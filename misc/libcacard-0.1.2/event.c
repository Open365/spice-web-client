/*
 *
 */
#include "vcard.h"
#include "vreader.h"
#include "vevent.h"

/*
 * OS includes
 */
#include <stdlib.h>

/*
 * from spice
 */
#include "mutex.h"

VEvent *
vevent_new(VEventType type, VReader *reader, VCard *card)
{
    VEvent *new_vevent;

    new_vevent = (VEvent *)malloc(sizeof(VEvent));
    if (new_vevent == NULL) {
        return NULL;
    }
    new_vevent->next = NULL;
    new_vevent->type = type;
    new_vevent->reader = vreader_reference(reader);
    new_vevent->card = vcard_reference(card);

    return new_vevent;
}

void
vevent_delete(VEvent *vevent)
{
    if (vevent == NULL) {
        return;
    }
    vreader_free(vevent->reader);
    vcard_free(vevent->card);
    free(vevent);
}

/*
 * VEvent queue management
 */

static VEvent *vevent_queue_head = NULL;
static VEvent *vevent_queue_tail = NULL;
static mutex_t vevent_queue_lock;
static condition_t vevent_queue_condition;

void vevent_queue_init(void)
{
    MUTEX_INIT(vevent_queue_lock);
    CONDITION_INIT(vevent_queue_condition);
    vevent_queue_head = vevent_queue_tail = NULL;
}

void
vevent_queue_vevent(VEvent *vevent)
{
    vevent->next = NULL;
    MUTEX_LOCK(vevent_queue_lock);
    if (vevent_queue_head) {
        assert(vevent_queue_tail);
        vevent_queue_tail->next = vevent;
    } else {
        vevent_queue_head = vevent;
    }
    vevent_queue_tail = vevent;
    CONDITION_NOTIFY(vevent_queue_condition);
    MUTEX_UNLOCK(vevent_queue_lock);
}

/* must have lock */
static VEvent *
vevent_dequeue_vevent(void)
{
    VEvent *vevent = NULL;
    if (vevent_queue_head) {
        vevent = vevent_queue_head;
        vevent_queue_head = vevent->next;
        vevent->next = NULL;
    }
    return vevent;
}

VEvent * vevent_wait_next_vevent(void)
{
    VEvent *vevent;

    MUTEX_LOCK(vevent_queue_lock);
    while ((vevent = vevent_dequeue_vevent()) == NULL) {
        CONDITION_WAIT(vevent_queue_condition, vevent_queue_lock);
    }
    MUTEX_UNLOCK(vevent_queue_lock);
    return vevent;
}

VEvent * vevent_get_next_vevent(void)
{
    VEvent *vevent;

    MUTEX_LOCK(vevent_queue_lock);
    vevent = vevent_dequeue_vevent();
    MUTEX_UNLOCK(vevent_queue_lock);
    return vevent;
}

