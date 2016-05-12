/*
 *
 */

#ifndef EVENTT_H
#define EVENTT_H 1
#include "vreadert.h"
#include "vcardt.h"

typedef struct VEventStruct VEvent;

typedef enum {
    VEVENT_READER_INSERT,
    VEVENT_READER_REMOVE,
    VEVENT_CARD_INSERT,
    VEVENT_CARD_REMOVE,
    VEVENT_LAST,
} VEventType;

struct VEventStruct {
    VEvent *next;
    VEventType type;
    VReader *reader;
    VCard *card;
};
#endif


