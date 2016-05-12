NULL =

INCLUDES= \
	-I.			\
	$(NSS_CFLAGS) \
	$(PCSC_CFLAGS) \
        $(USE_PASSTHRU) \
	$(NULL)

lib_LTLIBRARIES = libcacard.la

libcacard_la_LIBADD =		\
	$(NSS_LIBS)				\
	$(PCSC_LIBS)				\
	$(NULL)


libcacard_la_SOURCES= \
	cac.c \
	card_7816.c \
	event.c \
	passthru.c \
	vcard_emul_nss.c \
	vcard_emul_type.c \
	vcard.c \
	vreader.c \
	$(NULL)

libcacardincludedir = $(includedir)/cacard

libcacardinclude_HEADERS = \
	vcard.h \
	vcardt.h \
	card_7816.h \
	card_7816t.h \
	vreader.h \
	vreadert.h \
	vevent.h \
	eventt.h \
	vcard_emul.h \
	vcard_emul_type.h \
	vscard_common.h \
	cac.h \
	mutex.h \
	passthru.h \
	$(NULL)

pkgconfigdir = $(libdir)/pkgconfig
pkgconfig_DATA = libcacard.pc

#OBJS = ${SOURCES:.c=.o}

bin_PROGRAMS = vscclient

vscclient_SOURCES = \
	vscclient.c		\
	$(NULL)

vscclient_LDADD = \
	$(top_builddir)/libcacard.la        \
	$(NULL)

doclean:	
	rm -f $(OBJS) link_test __htest.c __test.o vscclient

#
# Test targets....
#

# make sure our includes are self supporting
header_test:
	@for i in $(INCLUDE) ; do \
	   echo "#include \"$$i\"" > __htest.c ;\
	   echo "#include \"$$i\"" >> __htest.c ;\
	   cat __htest.c ; \
	   cc -c __htest.c ;\
	done
	@rm __htest.c __htest.o

# make sure we don't have any missing symbols
link_test: link_test.c $(OBJS)
	cc -o link_test link_test.c  $(OBJS) $(LDFLAGS)

# Do all the tests at once
tests: all link_test header_test

