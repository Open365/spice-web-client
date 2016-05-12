#ifdef HAVE_CONFIG_H
#include "config.h"
#endif

#include <stdio.h>
#include <stdlib.h>
#include "laplace.c"
#include "stack_alloc.h"
#include "entenc.c"
#include "entdec.c"
#include "rangeenc.c"
#include "rangedec.c"

int main(void)
{
   int i;
   int ret = 0;
   ec_enc enc;
   ec_dec dec;
   ec_byte_buffer buf;
   int val[10000], decay[10000];
   ALLOC_STACK;
   ec_byte_writeinit(&buf);
   ec_enc_init(&enc,&buf);
   
   val[0] = 3; decay[0] = 6000;
   val[1] = 0; decay[1] = 5800;
   val[2] = -1; decay[2] = 5600;
   for (i=3;i<10000;i++)
   {
      val[i] = rand()%15-7;
      decay[i] = rand()%11000+5000;
   }
   for (i=0;i<10000;i++)
      ec_laplace_encode(&enc, &val[i], decay[i]);      
      
   ec_enc_done(&enc);

   ec_byte_readinit(&buf,ec_byte_get_buffer(&buf),ec_byte_bytes(&buf));
   ec_dec_init(&dec,&buf);

   for (i=0;i<10000;i++)
   {
      int d = ec_laplace_decode(&dec, decay[i]);
      if (d != val[i])
      {
         fprintf (stderr, "Got %d instead of %d\n", d, val[i]);
         ret = 1;
      }
   }
   
   ec_byte_writeclear(&buf);
   return ret;
}
