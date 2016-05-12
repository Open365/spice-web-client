/*
 * defines the entry point for the cac card. Only used by cac.c anc
 * vcard_emul_type.c
 */
#ifndef CAC_H
#define CAC_H 1
#include "vcard.h"
#include "vreader.h"
/*
 * Initialize the cac card. This is the only public function in this file. All
 * the rest are connected through function pointers.
 */
VCardStatus cac_card_init(VReader *reader, VCard *card, const char *params,
              unsigned char * const *cert, int cert_len[],
              VCardKey *key[] /* adopt the keys*/,
              int cert_count);

/* not yet implemented */
VCardStatus cac_is_cac_card(VReader *reader);
#endif
