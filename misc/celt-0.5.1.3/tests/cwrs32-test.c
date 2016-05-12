#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <stdio.h>
#include "entdec.c"
#include "entenc.c"
#include "rangeenc.c"
#include "rangedec.c"
#include "cwrs.c"
#include <string.h>
#define NMAX (10)
#define MMAX (9)

int main(int _argc,char **_argv){
  int n;
  for(n=2;n<=NMAX;n++){
    int m;
    for(m=1;m<=MMAX;m++){
      celt_uint32_t uu[MMAX+2];
      celt_uint32_t inc;
      celt_uint32_t nc;
      celt_uint32_t i;
      nc=ncwrs_u32(n,m,uu);
      inc=nc/10000;
      if(inc<1)inc=1;
      for(i=0;i<nc;i+=inc){
        celt_uint32_t u[MMAX+2];
        int           y[NMAX];
        celt_uint32_t v;
        memcpy(u,uu,(m+2)*sizeof(*u));
        cwrsi32(n,m,i,y,u);
        /*printf("%6u of %u:",i,nc);
        for(k=0;k<n;k++)printf(" %+3i",y[k]);
        printf(" ->");*/
        if(icwrs32(n,m,&v,y,u)!=i){
          fprintf(stderr,"Combination-index mismatch.\n");
          return 1;
        }
        if(v!=nc){
          fprintf(stderr,"Combination count mismatch.\n");
          return 2;
        }
        /*printf(" %6u\n",i);*/
      }
      /*printf("\n");*/
    }
  }
  return 0;
}
