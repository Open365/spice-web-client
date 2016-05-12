/*
 *
 */
#ifndef EVENT_H
#define EVENT_H 1
#include "eventt.h"
#include "vreadert.h"
#include "vcardt.h"

VEvent *vevent_new(VEventType type, VReader *reader, VCard *card);
void vevent_delete(VEvent *);

/*
 * VEvent queueing services
 */
void vevent_queue_vevent(VEvent *);
void vevent_queue_init(void);

/*
 *  VEvent dequeing services
 */
VEvent *vevent_wait_next_vevent(void);
VEvent *vevent_get_next_vevent(void);


#endif
