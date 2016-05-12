/*
 * passthru card type emulator and passhtru emulator.
 *
 * passhtru card type emulator can be used with other low level card emulators,
 * as long as they can recognize card insertion and removals.
 *
 * the passthru vcard_emulator, can only use passthru card types.
 *
 * Be careful using passthru. 1) passthru does not know the locking state of
 * the card from the guest side, and thus does not try to get locks. This means
 * client access can interfere with the guest use of the card. 2) passthru does
 * not provide the guest and client unique login states for the card. That
 * means that it is possible for the guest to access private data on the
 * card without authenticating. You have been warned.
 *
 * Passthru is most useful in the following cases: 1) provisioning. Card type
 *  emulators cannot emulate the open platform secure connections because the
 *  client software does not have access to the global platform keys on the
 *  card. Passthru drives these apdu's directly to the card. 2) odd cards. If
 *  you have guest software the knows how to access the card, but no client
 *  side PKCS #11 module, then passthru can provide access to those cards.
 */

#ifndef PASSTHRU_H
#define PASSTHRU_H 1

#include "vcard.h"
#include "vcard_emul.h"
#include "vreader.h"

/*
 * Initialize the card. This is the only 'card type emulator' portion of this
 * the rest are connected through function pointers. NOTE: certs are ignored,
 * keys are freed.
 */
VCardStatus passthru_card_init(VReader *vreader, VCard *card,
              const char *flags, unsigned char * const *cert, int cert_len[],
              VCardKey *key[], int cert_count);

/*
 * Use this instead of vcard_emul_init to initialize passthru.
 * passthru is the exception to the rule that only one emul can be compiled
 * at once. NOTE: you can still have only one emul active at once. The
 * passhtru card type emul, however can be used with other emuls.
 *
 * passthru does not support other card type emuls.
 */
VCardStatus passthru_emul_init(VCardEmulOptions *options);
VCardEmulOptions *passthru_emul_options(const char *args);
#endif
