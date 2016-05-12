/* (C) 2007-2008 Timothy B. Terriberry
   (C) 2008 Jean-Marc Valin */
/*
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

   - Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

   - Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

   - Neither the name of the Xiph.org Foundation nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE FOUNDATION OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* Functions for encoding and decoding pulse vectors.
   These are based on the function
     U(n,m) = U(n-1,m) + U(n,m-1) + U(n-1,m-1),
     U(n,1) = U(1,m) = 2,
    which counts the number of ways of placing m pulses in n dimensions, where
     at least one pulse lies in dimension 0.
   For more details, see: http://people.xiph.org/~tterribe/notes/cwrs.html
*/

#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include "os_support.h"
#include <stdlib.h>
#include <string.h>
#include "cwrs.h"
#include "mathops.h"
#include "arch.h"

/*Guaranteed to return a conservatively large estimate of the binary logarithm
   with frac bits of fractional precision.
  Tested for all possible 32-bit inputs with frac=4, where the maximum
   overestimation is 0.06254243 bits.*/
int log2_frac(ec_uint32 val, int frac)
{
  int l;
  l=EC_ILOG(val);
  if(val&val-1){
    /*This is (val>>l-16), but guaranteed to round up, even if adding a bias
       before the shift would cause overflow (e.g., for 0xFFFFxxxx).*/
    if(l>16)val=(val>>l-16)+((val&(1<<l-16)-1)+(1<<l-16)-1>>l-16);
    else val<<=16-l;
    l=l-1<<frac;
    /*Note that we always need one iteration, since the rounding up above means
       that we might need to adjust the integer part of the logarithm.*/
    do{
      int b;
      b=(int)(val>>16);
      l+=b<<frac;
      val=val+b>>b;
      val=val*val+0x7FFF>>15;
    }
    while(frac-->0);
    /*If val is not exactly 0x8000, then we have to round up the remainder.*/
    return l+(val>0x8000);
  }
  /*Exact powers of two require no rounding.*/
  else return l-1<<frac;
}

int fits_in32(int _n, int _m)
{
   static const celt_int16_t maxN[15] = {
      255, 255, 255, 255, 255, 109,  60,  40,
       29,  24,  20,  18,  16,  14,  13};
   static const celt_int16_t maxM[15] = {
      255, 255, 255, 255, 255, 238,  95,  53,
       36,  27,  22,  18,  16,  15,  13};
   if (_n>=14)
   {
      if (_m>=14)
         return 0;
      else
         return _n <= maxN[_m];
   } else {
      return _m <= maxM[_n];
   }   
}

#define MASK32 (0xFFFFFFFF)

/*INV_TABLE[i] holds the multiplicative inverse of (2*i-1) mod 2**32.*/
static const celt_uint32_t INV_TABLE[128]={
  0x00000001,0xAAAAAAAB,0xCCCCCCCD,0xB6DB6DB7,
  0x38E38E39,0xBA2E8BA3,0xC4EC4EC5,0xEEEEEEEF,
  0xF0F0F0F1,0x286BCA1B,0x3CF3CF3D,0xE9BD37A7,
  0xC28F5C29,0x684BDA13,0x4F72C235,0xBDEF7BDF,
  0x3E0F83E1,0x8AF8AF8B,0x914C1BAD,0x96F96F97,
  0xC18F9C19,0x2FA0BE83,0xA4FA4FA5,0x677D46CF,
  0x1A1F58D1,0xFAFAFAFB,0x8C13521D,0x586FB587,
  0xB823EE09,0xA08AD8F3,0xC10C9715,0xBEFBEFBF,
  0xC0FC0FC1,0x07A44C6B,0xA33F128D,0xE327A977,
  0xC7E3F1F9,0x962FC963,0x3F2B3885,0x613716AF,
  0x781948B1,0x2B2E43DB,0xFCFCFCFD,0x6FD0EB67,
  0xFA3F47E9,0xD2FD2FD3,0x3F4FD3F5,0xD4E25B9F,
  0x5F02A3A1,0xBF5A814B,0x7C32B16D,0xD3431B57,
  0xD8FD8FD9,0x8D28AC43,0xDA6C0965,0xDB195E8F,
  0x0FDBC091,0x61F2A4BB,0xDCFDCFDD,0x46FDD947,
  0x56BE69C9,0xEB2FDEB3,0x26E978D5,0xEFDFBF7F,
  0x0FE03F81,0xC9484E2B,0xE133F84D,0xE1A8C537,
  0x077975B9,0x70586723,0xCD29C245,0xFAA11E6F,
  0x0FE3C071,0x08B51D9B,0x8CE2CABD,0xBF937F27,
  0xA8FE53A9,0x592FE593,0x2C0685B5,0x2EB11B5F,
  0xFCD1E361,0x451AB30B,0x72CFE72D,0xDB35A717,
  0xFB74A399,0xE80BFA03,0x0D516325,0x1BCB564F,
  0xE02E4851,0xD962AE7B,0x10F8ED9D,0x95AEDD07,
  0xE9DC0589,0xA18A4473,0xEA53FA95,0xEE936F3F,
  0x90948F41,0xEAFEAFEB,0x3D137E0D,0xEF46C0F7,
  0x028C1979,0x791064E3,0xC04FEC05,0xE115062F,
  0x32385831,0x6E68575B,0xA10D387D,0x6FECF2E7,
  0x3FB47F69,0xED4BFB53,0x74FED775,0xDB43BB1F,
  0x87654321,0x9BA144CB,0x478BBCED,0xBFB912D7,
  0x1FDCD759,0x14B2A7C3,0xCB125CE5,0x437B2E0F,
  0x10FEF011,0xD2B3183B,0x386CAB5D,0xEF6AC0C7,
  0x0E64C149,0x9A020A33,0xE6B41C55,0xFEFEFEFF
};

/*Computes (_a*_b-_c)/(2*_d-1) when the quotient is known to be exact.
  _a, _b, _c, and _d may be arbitrary so long as the arbitrary precision result
   fits in 32 bits, but currently the table for multiplicative inverses is only
   valid for _d<128.*/
static inline celt_uint32_t imusdiv32odd(celt_uint32_t _a,celt_uint32_t _b,
 celt_uint32_t _c,celt_uint32_t _d){
  return (_a*_b-_c)*INV_TABLE[_d]&MASK32;
}

/*Computes (_a*_b-_c)/_d when the quotient is known to be exact.
  _d does not actually have to be even, but imusdiv32odd will be faster when
   it's odd, so you should use that instead.
  _a and _d are assumed to be small (e.g., _a*_d fits in 32 bits; currently the
   table for multiplicative inverses is only valid for _d<256).
  _b and _c may be arbitrary so long as the arbitrary precision reuslt fits in
   32 bits.*/
static inline celt_uint32_t imusdiv32even(celt_uint32_t _a,celt_uint32_t _b,
 celt_uint32_t _c,celt_uint32_t _d){
  celt_uint32_t inv;
  int      mask;
  int      shift;
  int      one;
  shift=EC_ILOG(_d^_d-1);
  inv=INV_TABLE[_d-1>>shift];
  shift--;
  one=1<<shift;
  mask=one-1;
  return (_a*(_b>>shift)-(_c>>shift)+
   (_a*(_b&mask)+one-(_c&mask)>>shift)-1)*inv&MASK32;
}

/*Computes the next row/column of any recurrence that obeys the relation
   u[i][j]=u[i-1][j]+u[i][j-1]+u[i-1][j-1].
  _ui0 is the base case for the new row/column.*/
static inline void unext32(celt_uint32_t *_ui,int _len,celt_uint32_t _ui0){
  celt_uint32_t ui1;
  int           j;
  /* doing a do-while would overrun the array if we had less than 2 samples */
  j=1; do {
    ui1=UADD32(UADD32(_ui[j],_ui[j-1]),_ui0);
    _ui[j-1]=_ui0;
    _ui0=ui1;
  } while (++j<_len);
  _ui[j-1]=_ui0;
}

/*Computes the previous row/column of any recurrence that obeys the relation
   u[i-1][j]=u[i][j]-u[i][j-1]-u[i-1][j-1].
  _ui0 is the base case for the new row/column.*/
static inline void uprev32(celt_uint32_t *_ui,int _n,celt_uint32_t _ui0){
  celt_uint32_t ui1;
  int           j;
  /* doing a do-while would overrun the array if we had less than 2 samples */
  j=1; do {
    ui1=USUB32(USUB32(_ui[j],_ui[j-1]),_ui0);
    _ui[j-1]=_ui0;
    _ui0=ui1;
  } while (++j<_n);
  _ui[j-1]=_ui0;
}

/*Returns the number of ways of choosing _m elements from a set of size _n with
   replacement when a sign bit is needed for each unique element.
  _u: On exit, _u[i] contains U(_n,i) for i in [0..._m+1].*/
celt_uint32_t ncwrs_u32(int _n,int _m,celt_uint32_t *_u){
  celt_uint32_t um2;
  int           k;
  int           len;
  len=_m+2;
  _u[0]=0;
  _u[1]=um2=1;
  if(_n<=6){
    /*If _n==0, _u[0] should be 1 and the rest should be 0.*/
    /*If _n==1, _u[i] should be 1 for i>1.*/
    celt_assert(_n>=2);
    /*If _m==0, the following do-while loop will overflow the buffer.*/
    celt_assert(_m>0);
    k=2;
    do _u[k]=(k<<1)-1;
    while(++k<len);
    for(k=2;k<_n;k++)
      unext32(_u+1,_m+1,1);
  }
  else{
    celt_uint32_t um1;
    celt_uint32_t n2m1;
    _u[2]=n2m1=um1=(_n<<1)-1;
    for(k=3;k<len;k++){
      /*U(n,m) = ((2*n-1)*U(n,m-1)-U(n,m-2))/(m-1) + U(n,m-2)*/
      _u[k]=um2=imusdiv32even(n2m1,um1,um2,k-1)+um2;
      if(++k>=len)break;
      _u[k]=um1=imusdiv32odd(n2m1,um2,um1,k-1>>1)+um1;
    }
  }
  return _u[_m]+_u[_m+1];
}



/*Returns the _i'th combination of _m elements chosen from a set of size _n
   with associated sign bits.
  _y: Returns the vector of pulses.
  _u: Must contain entries [0..._m+1] of row _n of U() on input.
      Its contents will be destructively modified.*/
void cwrsi32(int _n,int _m,celt_uint32_t _i,int *_y,celt_uint32_t *_u){
  int j;
  int k;
  celt_assert(_n>0);
  j=0;
  k=_m;
  do{
    celt_uint32_t p;
    int           s;
    int           yj;
    p=_u[k+1];
    s=_i>=p;
    if(s)_i-=p;
    yj=k;
    p=_u[k];
    while(p>_i)p=_u[--k];
    _i-=p;
    yj-=k;
    _y[j]=yj-(yj<<1&-s);
    uprev32(_u,k+2,0);
  }
  while(++j<_n);
}


/*Returns the index of the given combination of _m elements chosen from a set
   of size _n with associated sign bits.
  _y:  The vector of pulses, whose sum of absolute values must be _m.
  _nc: Returns V(_n,_m).*/
celt_uint32_t icwrs32(int _n,int _m,celt_uint32_t *_nc,const int *_y,
 celt_uint32_t *_u){
  celt_uint32_t i;
  int           j;
  int           k;
  /*We can't unroll the first two iterations of the loop unless _n>=2.*/
  celt_assert(_n>=2);
  i=_y[_n-1]<0;
  _u[0]=0;
  for(k=1;k<=_m+1;k++)_u[k]=(k<<1)-1;
  k=abs(_y[_n-1]);
  j=_n-2;
  i+=_u[k];
  k+=abs(_y[j]);
  if(_y[j]<0)i+=_u[k+1];
  while(j-->0){
    unext32(_u,_m+2,0);
    i+=_u[k];
    k+=abs(_y[j]);
    if(_y[j]<0)i+=_u[k+1];
  }
  *_nc=_u[_m]+_u[_m+1];
  return i;
}

static inline void encode_pulse32(int _n,int _m,const int *_y,ec_enc *_enc){
  VARDECL(celt_uint32_t,u);
  celt_uint32_t nc;
  celt_uint32_t i;
  SAVE_STACK;
  ALLOC(u,_m+2,celt_uint32_t);
  i=icwrs32(_n,_m,&nc,_y,u);
  ec_enc_uint(_enc,i,nc);
  RESTORE_STACK;
}

int get_required_bits32(int N, int K, int frac)
{
   int nbits;
   VARDECL(celt_uint32_t,u);
   SAVE_STACK;
   ALLOC(u,K+2,celt_uint32_t);
   nbits = log2_frac(ncwrs_u32(N,K,u), frac);
   RESTORE_STACK;
   return nbits;
}

void get_required_bits(celt_int16_t *bits,int N, int MAXK, int frac)
{
   int k;
   /*We special case k==0 below, since fits_in32 could reject it for large N.*/
   celt_assert(MAXK>0);
   if(fits_in32(N,MAXK-1)){
      bits[0]=0;
      /*This could be sped up one heck of a lot if we didn't recompute u in
         ncwrs_u32 every time.*/
      for(k=1;k<MAXK;k++)bits[k]=get_required_bits32(N,k,frac);
   }
   else{
      VARDECL(celt_int16_t,n1bits);
      VARDECL(celt_int16_t,_n2bits);
      celt_int16_t *n2bits;
      SAVE_STACK;
      ALLOC(n1bits,MAXK,celt_int16_t);
      ALLOC(_n2bits,MAXK,celt_int16_t);
      get_required_bits(n1bits,(N+1)/2,MAXK,frac);
      if(N&1){
        n2bits=_n2bits;
        get_required_bits(n2bits,N/2,MAXK,frac);
      }else{
        n2bits=n1bits;
      }
      bits[0]=0;
      for(k=1;k<MAXK;k++){
         if(fits_in32(N,k))bits[k]=get_required_bits32(N,k,frac);
         else{
            int worst_bits;
            int i;
            worst_bits=0;
            for(i=0;i<=k;i++){
               int split_bits;
               split_bits=n1bits[i]+n2bits[k-i];
               if(split_bits>worst_bits)worst_bits=split_bits;
            }
            bits[k]=log2_frac(k+1,frac)+worst_bits;
         }
      }
   RESTORE_STACK;
   }
}


void encode_pulses(int *_y, int N, int K, ec_enc *enc)
{
   if (K==0) {
   } else if (N==1)
   {
      ec_enc_bits(enc, _y[0]<0, 1);
   } else if(fits_in32(N,K))
   {
      encode_pulse32(N, K, _y, enc);
   } else {
     int i;
     int count=0;
     int split;
     split = (N+1)/2;
     for (i=0;i<split;i++)
        count += abs(_y[i]);
     ec_enc_uint(enc,count,K+1);
     encode_pulses(_y, split, count, enc);
     encode_pulses(_y+split, N-split, K-count, enc);
   }
}

static inline void decode_pulse32(int _n,int _m,int *_y,ec_dec *_dec){
  VARDECL(celt_uint32_t,u);
  SAVE_STACK;
  ALLOC(u,_m+2,celt_uint32_t);
  cwrsi32(_n,_m,ec_dec_uint(_dec,ncwrs_u32(_n,_m,u)),_y,u);
  RESTORE_STACK;
}

void decode_pulses(int *_y, int N, int K, ec_dec *dec)
{
   if (K==0) {
      int i;
      for (i=0;i<N;i++)
         _y[i] = 0;
   } else if (N==1)
   {
      int s = ec_dec_bits(dec, 1);
      if (s==0)
         _y[0] = K;
      else
         _y[0] = -K;
   } else if(fits_in32(N,K))
   {
      decode_pulse32(N, K, _y, dec);
   } else {
     int split;
     int count = ec_dec_uint(dec,K+1);
     split = (N+1)/2;
     decode_pulses(_y, split, count, dec);
     decode_pulses(_y+split, N-split, K-count, dec);
   }
}
