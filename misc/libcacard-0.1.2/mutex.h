/* -*- Mode: C; c-basic-offset: 4; indent-tabs-mode: nil -*- */
/*
   Copyright (C) 2009 Red Hat, Inc.

   This library is free software; you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public
   License as published by the Free Software Foundation; either
   version 2.1 of the License, or (at your option) any later version.

   This library is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public
   License along with this library; if not, see <http://www.gnu.org/licenses/>.
*/

/*
 *  This header file provides a way of mapping windows and linux thread calls
 *  to a set of macros.  Ideally this would be shared by whatever subsystem we
 *  link with.
 */

#ifndef _H_MUTEX
#define _H_MUTEX
#ifdef _WIN32
#include <windows.h>
typedef CRITICAL_SECTION mutex_t;
#define MUTEX_INIT(mutex) InitializeCriticalSection(&mutex)
#define MUTEX_LOCK(mutex) EnterCriticalSection(&mutex)
#define MUTEX_UNLOCK(mutex) LeaveCriticalSection(&mutex)
typedef CONDITION_VARIABLE condition_t;
#define CONDITION_INIT(cond) InitializeConditionVariable(&cond)
#define CONDITION_WAIT(cond,mutex) \
            SleepConditionVariableCS(&cond,&mutex,INFINTE)
#define CONDITION_NOTIFY(cond) WakeConditionVariable(&cond)
typedef uint32_t thread_t;
typedef HANDLE thread_status_t;
#define THREAD_CREATE(tid, func, arg) \
        CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)func, arg, 0, &tid)
#define THREAD_SUCCESS(status) ((status) !=  NULL)
#else
#include <pthread.h>
typedef pthread_mutex_t mutex_t;
#define MUTEX_INIT(mutex) pthread_mutex_init(&mutex, NULL)
#define MUTEX_LOCK(mutex) pthread_mutex_lock(&mutex)
#define MUTEX_UNLOCK(mutex) pthread_mutex_unlock(&mutex)
typedef pthread_cond_t condition_t;
#define CONDITION_INIT(cond) pthread_cond_init(&cond, NULL)
#define CONDITION_WAIT(cond,mutex) pthread_cond_wait(&cond,&mutex)
#define CONDITION_NOTIFY(cond) pthread_cond_signal(&cond)
typedef pthread_t thread_t;
typedef int thread_status_t;
#define THREAD_CREATE(tid, func, arg) pthread_create(&tid, NULL, func, arg)
#define THREAD_SUCCESS(status)  ((status) == 0)
#endif

#endif /* _H_MUTEX */
