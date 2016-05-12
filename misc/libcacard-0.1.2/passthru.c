/*
 * implement the applets for the CAC card.
 */
#ifdef USE_PASSTHRU
#include "vcard.h"
#include "vcard_emul.h"
#include "card_7816.h"
#include "vreader.h"
#include "mutex.h"
#include "vcard_emul.h"
#include "passthru.h"
#include <stdlib.h>
#include <string.h>
#include <pcsclite.h>

/*
 * Passthru applet private data
 */
struct VCardAppletPrivateStruct {
    char *reader_name;
    /* pcsc-lite parameters */
    SCARDHANDLE hCard;
    uint32_t hProtocol;
    SCARD_IO_REQUEST *send_io;
    unsigned char atr[MAX_ATR_SIZE];
    int atr_len;
};

static SCARDCONTEXT global_context = 0;

#define MAX_RESPONSE_LENGTH 261 /*65537 */
/*
 * handle all the APDU's that are common to all CAC applets
 */
static VCardStatus
passthru_process_apdu(VCard *card, VCardAPDU *apdu, VCardResponse **response)
{
    LONG rv;
    unsigned char buf[MAX_RESPONSE_LENGTH];
    uint32_t len = MAX_RESPONSE_LENGTH;
    VCardAppletPrivate *applet_private = NULL;
    SCARD_IO_REQUEST receive_io;

    applet_private = vcard_get_current_applet_private(card, 0);
    if (applet_private == NULL) {
       *response = vcard_make_response(VCARD7816_STATUS_EXC_ERROR);
       return VCARD_DONE;
    }

    rv = SCardTransmit(applet_private->hCard, applet_private->send_io,
                       apdu->a_data, apdu->a_len, &receive_io, buf, &len);
    if (rv != SCARD_S_SUCCESS) {
       *response = vcard_make_response(VCARD7816_STATUS_EXC_ERROR);
       return VCARD_DONE;
    }

    *response = vcard_response_new_data(buf,len);
    if (*response == NULL) {
       *response =
            vcard_make_response(VCARD7816_STATUS_EXC_ERROR_MEMORY_FAILURE);
    } else {
       (*response)->b_total_len = (*response)->b_len;
    }
    return VCARD_DONE;
}

static void
passthru_card_set_atr(VCard *card, unsigned char *atr, int atr_len)
{
    VCardAppletPrivate *applet_private = NULL;
    applet_private = vcard_get_current_applet_private(card, 0);
    if (applet_private == NULL) {
        return;
    }
    applet_private->atr_len = MIN(atr_len, sizeof(applet_private->atr));
    memcpy(applet_private->atr, atr, applet_private->atr_len);
}

static void passthru_card_get_atr(VCard *card, unsigned char *atr, int *atr_len)
{
    VCardAppletPrivate *applet_private = NULL;
    SCARD_READERSTATE *state;

    applet_private = vcard_get_current_applet_private(card, 0);
    if ((applet_private == NULL) || (applet_private->atr_len == 0)) {
        vcard_emul_get_atr(card, atr, atr_len);
        return;
    }
    *atr_len = MIN(applet_private->atr_len, *atr_len);
    memcpy(atr,applet_private->atr,*atr_len);
    return;
}

/*
 *  resest the inter call state between applet selects
 */
static VCardStatus
passthru_reset(VCard *card, int channel)
{
    return VCARD_DONE;
}

static VCardStatus
passthru_pcsc_lite_init()
{
    LONG rv;
    if (global_context != 0) {
        return VCARD_DONE;
    }
    rv = SCardEstablishContext(SCARD_SCOPE_SYSTEM, NULL, NULL, &global_context);
    if (rv != SCARD_S_SUCCESS) {
        return VCARD_FAIL;
    }
    return VCARD_DONE;
}

/*
 *  match if s1 is completely contained in s2
 */
static int
string_match(const char *s1, const char *s2)
{
    int len = strlen(s1);
    const char *start;

    for (start = strchr(s2, *s1); start; start = strchr(start+1, *s1)) {
       if (strncmp(start, s1, len) == 0) {
           return 1;
       }
    }
    return 0;
}


/*
 *  Look for the reader that best matches the name for VReader
 */
static char *
passthru_get_reader_name(VReader *reader)
{
    const char *reader_name = vreader_get_name(reader);
    char *reader_list = NULL;
    char *reader_entry = NULL;
    char *reader_match = NULL;
    uint32_t reader_string_length;
    VCardStatus status;
    LONG rv;

    if (reader_name == NULL) {
        return NULL;
    }

    status = passthru_pcsc_lite_init();
    if (status != VCARD_DONE) {
       return NULL;
    }


    /* find the existing reader names */
    rv = SCardListReaders(global_context, NULL, NULL, &reader_string_length);
    if (rv !=  SCARD_S_SUCCESS) {
       return NULL;
    }
    reader_list = (char *)malloc(reader_string_length);
    rv = SCardListReaders(global_context, NULL, reader_list,
                          &reader_string_length);
    if (rv !=  SCARD_S_SUCCESS) {
       goto cleanup;
    }

    /* match that name */
    for (reader_entry= reader_list;*reader_entry;
                                   reader_entry += strlen(reader_entry)+1) {
       if (string_match(reader_entry, reader_name)) {
           reader_match = strdup(reader_entry);
           break;
       }
    }
cleanup:
    if (reader_list) {
        free(reader_list);
    }
    return reader_match;
}


/*
 * utilities for creating and destroying the private applet data
 */
static void
passthru_delete_applet_private(VCardAppletPrivate *applet_private)
{
    if (applet_private == NULL) {
        return;
    }
    if (applet_private->hCard) {
        SCardDisconnect(applet_private->hCard,SCARD_LEAVE_CARD);
    }
    if (applet_private->reader_name != NULL) {
        free(applet_private->reader_name);
    }
    free(applet_private);
}

static VCardAppletPrivate *
passthru_new_applet_private(VReader *reader)
{
    VCardAppletPrivate *applet_private = NULL;
    LONG rv;

    applet_private = (VCardAppletPrivate *)malloc(sizeof(VCardAppletPrivate));

    if (applet_private == NULL) {
        goto fail;
    }
    applet_private->hCard = 0;
    applet_private->reader_name = NULL;

    applet_private->reader_name = passthru_get_reader_name(reader);
    if (applet_private->reader_name == NULL) {
        goto fail;
    }

    rv = SCardConnect( global_context, applet_private->reader_name,
       SCARD_SHARE_DIRECT, SCARD_PROTOCOL_T0|SCARD_PROTOCOL_T1,
        &applet_private->hCard,
        &applet_private->hProtocol);
    if (rv !=  SCARD_S_SUCCESS) {
        goto fail;
    }

    if (applet_private->hProtocol == SCARD_PROTOCOL_T0) {
        applet_private->send_io = SCARD_PCI_T0;
    } else {
        applet_private->send_io = SCARD_PCI_T1;
    }
    applet_private->atr_len = 0;
    return applet_private;

fail:
    if (applet_private) {
        passthru_delete_applet_private(applet_private);
    }
    return NULL;
}


/*
 * create a new applet which links to our override function.
 */
static VCardApplet *
passthru_new_applet(VReader *reader)
{
    VCardAppletPrivate *applet_private = NULL;
    VCardApplet *applet = NULL;
    unsigned char passthru_aid[] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
    int passthru_aid_len = sizeof (passthru_aid);

    applet_private = passthru_new_applet_private(reader);
    if (applet_private == NULL) {
        goto failure;
    }
    applet = vcard_new_applet(passthru_process_apdu, passthru_reset,
                              passthru_aid, passthru_aid_len);
    if (applet == NULL) {
        goto failure;
    }
    vcard_set_applet_private(applet, applet_private,
                          passthru_delete_applet_private);
    applet_private = NULL;

    return applet;

failure:
    if (applet_private != NULL) {
        passthru_delete_applet_private(applet_private);
    }
    return NULL;
}



/*
 * Initialize the card. This is the only 'card type emulator' portion of this
 * the rest are connected through function pointers.
 */
VCardStatus
passthru_card_init(VReader *vreader, VCard *card,
              const char *flags,
              unsigned char * const *cert,
              int cert_len[],
              VCardKey *key[] /* adopt the keys*/,
              int cert_count)
{
    int i;
    VCardApplet *applet;

    /* Don't do soft emulation of the 7816, pass everything to the card */
    vcard_set_type(card,VCARD_DIRECT);

    applet = passthru_new_applet(vreader);
    if (applet == NULL) {
        goto failure;
    }

    vcard_add_applet(card, applet);

    /* we are adopting the keys, so free them now (since we don't use them) */
    for (i=0; i < cert_count; i++) {
      vcard_emul_delete_key(key[i]);
    }

    return VCARD_DONE;

failure:
    return VCARD_FAIL;
}

/*
 *  Begin passthru_emul code. This emulator only works with the passthru card
 *  type.
 *
 */

/*
 *  Get the state entry that matches this reader. If none found, return NULL
 */
static SCARD_READERSTATE_A *
passthru_get_reader_state(SCARD_READERSTATE_A *reader_states,
                          int reader_count, char *name)
{
    int i;

    for (i=0; i < reader_count; i++) {
        if (name == NULL && reader_states[i].szReader == NULL) {
            // looking for a blank slot to return
            return &reader_states[i];
        }
        if (name == NULL || reader_states[i].szReader == NULL) {
            continue;
        }
        if (strcmp(name, reader_states[i].szReader) == 0) {
            return &reader_states[i];
        }
    }
    return NULL;
}

/*
 * find a card slot that has been cleared out
 */
static SCARD_READERSTATE_A *
passthru_get_blank_reader(SCARD_READERSTATE_A *reader_states, int reader_count)
{
    return passthru_get_reader_state(reader_states,  reader_count, NULL);
}


/*
 *  This is the main work of the emulator, handling the thread that looks for
 *  changes in the readers and the cards.
 */
static void *
passthru_emul_event_thread(void *args)
{
    char *reader_list = NULL;
    int reader_list_len = 0;
    SCARD_READERSTATE_A *reader_states = NULL;
    int reader_count = 0;     /* number of active readers */
    int max_reader_count = 0; /* size of the reader_state array (including
                                 inactive readers) */
    LONG rv;
    int timeout=1000;
    int i;

    do {
        /* variables to hold on to our new values until we are ready to replace
         * our old values */
        char *new_reader_list = NULL;
        int new_reader_list_len = 0;
        int new_reader_count = 0;

        /* other temps */
        char * reader_entry;
        VReader *reader;

        /*
         * First check to see if the reader list has changed
         */
        rv = SCardListReaders(global_context, NULL, NULL, &new_reader_list_len);
        if (rv !=  SCARD_S_SUCCESS) {
           goto next;
        }
        /*
         * If the names have changed, we need to update our list and states.
         * This is where we detect reader insertions and removals.
         */
        if (new_reader_list_len != reader_list_len) {
            /* update the list */
            new_reader_list = (char *)malloc(new_reader_list_len);
            if (new_reader_list == NULL) {
                goto next;
            }
            rv = SCardListReaders(global_context, NULL, new_reader_list,
                                  &new_reader_list_len);
            if (rv !=  SCARD_S_SUCCESS) {
                free(new_reader_list);
                goto next;
            }
            /* clear out our event state */
            for (i=0; i < reader_count; i++) {
                    reader_states[i].dwEventState = 0;
            }
            /* count the readers and mark the ones that are still with us */
            for (reader_entry = new_reader_list; *reader_entry;
                 reader_entry += strlen(reader_entry)+1) {
                SCARD_READERSTATE_A *this_state;
                new_reader_count++;
                /* if the reader is still on the list, mark it present */
                this_state = passthru_get_reader_state(reader_states,
                                                       reader_count,
                                                       reader_entry);
                if (this_state) {
                    this_state->dwEventState = SCARD_STATE_PRESENT;
                }
            }
            /* eject any removed readers */
            for (i=0; i < reader_count; i++) {
                if (reader_states[i].dwEventState == SCARD_STATE_PRESENT) {
                    reader_states[i].dwEventState = 0;
                    continue;
                }
                reader = vreader_get_reader_by_name(reader_states[i].szReader);
                vreader_remove_reader(reader);
                vreader_free(reader);
                reader_states[i].szReader = NULL;
            }
            /* handle the shrinking list */
            if (new_reader_count < reader_count) {
                /* fold all the valid entries at the end of our reader_states
                 * array up into those locations vacated by ejected readers. */
                for (i=reader_count-1; i < (new_reader_count -1); i--) {
                        if (reader_states[i].szReader) {
                            SCARD_READERSTATE_A *blank_reader;
                            blank_reader =
                                passthru_get_blank_reader(reader_states,
                                                          new_reader_count);
                            assert(blank_reader);
                            *blank_reader = reader_states[i];
                            reader_states[i].szReader = NULL;
                        }
                 }
            }
            /* handle the growing list */
            if (new_reader_count >  max_reader_count) {
                SCARD_READERSTATE_A *new_reader_states;

                /* grow the list */
                new_reader_states =
                    (SCARD_READERSTATE_A *)realloc(reader_states,
                        sizeof(SCARD_READERSTATE_A)*new_reader_count);
                if (new_reader_states) {
                    /* successful, update our current state */
                    reader_states = new_reader_states;
                    max_reader_count = new_reader_count;
                } else {
                    new_reader_count = max_reader_count; /* couldn't get enough
                                                          * space to handle
                                                          * all the new readers
                                                          * */
                }
                /* mark our new entries as empty */
                for (i=reader_count; i > new_reader_count; i++) {
                    reader_states[i].szReader = NULL;
                }
            }
            /* now walk the reader list, updating the state */
            for (reader_entry = new_reader_list; *reader_entry;
                 reader_entry += strlen(reader_entry)+1) {
                SCARD_READERSTATE_A *this_state;
                this_state = passthru_get_reader_state(reader_states,
                                                       new_reader_count,
                                                       reader_entry);
                if (this_state) {
                    /* replace the old copy of the string with the new copy.
                     * This will allow us to free reader_list at the end */
                    reader_states->szReader = reader_entry;
                    continue;
                }
                /* this is a new reader, add it to the list */
                this_state =
                    passthru_get_blank_reader(reader_states, new_reader_count);
                if (!this_state) {
                    continue; /* this can happen of we couldn't get enough
                                 slots in the grow list */
                }
                this_state->szReader = reader_entry;
                this_state->dwCurrentState = SCARD_STATE_UNAWARE;
                reader = vreader_new(reader_entry, NULL, NULL);
                if (reader) {
                    vreader_add_reader(reader);
                }
                vreader_free(reader);
            }
            /* finally update our current variables */
            free(reader_list);
            reader_list = new_reader_list;
            reader_list_len = new_reader_list_len;
            reader_count = new_reader_count;
        }
next:
        rv = SCardGetStatusChange(global_context, timeout,
                                  reader_states, reader_count);
        if (rv == SCARD_E_TIMEOUT) {
            continue; /* check for new readers */
        }
        if (rv != SCARD_S_SUCCESS) {
            static int restarts = 0;
            VCardStatus status;

            /* try resetting the pcsc_lite subsystem */
            SCardReleaseContext(global_context);
            global_context = 0; /* should close it */
            printf("***** SCard failure %x\n", rv);
            restarts++;
            if (restarts >= 3) {
                printf("***** SCard failed %d times\n", restarts);
                return; /* exit thread */
            }
            status = passthru_pcsc_lite_init();
            assert(status == CARD_DONE);
            sleep(1);
            continue;
        }
        /* deal with card insertion/removal */
        for (i=0; i < reader_count ; i++) {
            if ((reader_states[i].dwEventState & SCARD_STATE_CHANGED) == 0) {
                continue;
            }
            reader_states[i].dwCurrentState = reader_states[i].dwEventState;
            reader = vreader_get_reader_by_name(reader_states[i].szReader);
            if (reader == NULL) {
                continue;
            }
            if (reader_states[i].dwEventState & SCARD_STATE_EMPTY) {
                if (vreader_card_is_present(reader) == VREADER_OK) {
                    vreader_insert_card(reader, NULL);
                }
            }
            if (reader_states[i].dwEventState & SCARD_STATE_PRESENT) {
                VCard *card;
                VCardStatus status = VCARD_FAIL;
                /* if there already was a card present, eject it before we
                 * insert the new one */
                if (vreader_card_is_present(reader) == VREADER_OK) {
                    vreader_insert_card(reader, NULL);
                }

                card = vcard_new(NULL, NULL);
                if (card != NULL) {
                    status = passthru_card_init(reader, card, "",
                                                NULL, NULL, NULL, 0);
                    passthru_card_set_atr(card, reader_states[i].rgbAtr,
                                  reader_states[i].cbAtr);
                    vcard_set_atr_func(card, passthru_card_get_atr);
                }
                if (status == VCARD_DONE) {
                    vreader_insert_card(reader, card);
                }
                vcard_free(card);
            }
            vreader_free(reader);
        }

     } while (1);
     return NULL;
}

/*
 *  Initializing the passthru emul is simply initializing pcsc-lite and
 *  launching the event thread.
 */
VCardStatus
passthru_emul_init(VCardEmulOptions *options)
{
    thread_t tid;
    thread_status_t tstatus;
    VCardStatus status;

    vreader_init();
    vevent_queue_init();

    status = passthru_pcsc_lite_init();
    if (status != VCARD_DONE) {
        return status;
    }

    /* launch reader thread */
    tstatus = THREAD_CREATE(tid, passthru_emul_event_thread, NULL);
    if (!THREAD_SUCCESS(tstatus)) {
        return VCARD_FAIL;
    }
    return VCARD_DONE;
}


VCardEmulOptions *
passthru_emul_options(const char *args)
{
    return NULL;
}
#endif
