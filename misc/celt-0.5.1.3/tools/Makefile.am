## Process this file with automake to produce Makefile.in. -*-Makefile-*-

# $Id: Makefile.am,v 1.11 2004/02/18 06:59:40 jm Exp $

# Disable automatic dependency tracking if using other tools than gcc and gmake
#AUTOMAKE_OPTIONS = no-dependencies

INCLUDES = -I$(top_srcdir)/libcelt -I$(top_builddir)/ @OGG_CFLAGS@

EXTRA_DIST = getopt_win.h getopt.c getopt1.c wave_out.c wave_out.h skeleton.h

include_HEADERS = 
noinst_HEADERS = wav_io.h

bin_PROGRAMS = celtenc@PACKAGE_APPEND@ celtdec@PACKAGE_APPEND@

celtenc@PACKAGE_APPEND@_SOURCES = celtenc.c wav_io.c skeleton.c
celtenc@PACKAGE_APPEND@_LDADD = $(top_builddir)/libcelt/libcelt@PACKAGE_APPEND@.la $(OGG_LIBS)

celtdec@PACKAGE_APPEND@_SOURCES = celtdec.c wav_io.c
celtdec@PACKAGE_APPEND@_LDADD = $(top_builddir)/libcelt/libcelt@PACKAGE_APPEND@.la $(OGG_LIBS)
