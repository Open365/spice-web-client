AC_PREREQ([2.60])

m4_define([CAC_MAJOR], 0)
m4_define([CAC_MINOR], 1)
m4_define([CAC_MICRO], 2)

AC_INIT(libcacard, [CAC_MAJOR.CAC_MINOR.CAC_MICRO], [], libcacard)

AC_CONFIG_MACRO_DIR([m4])
AM_CONFIG_HEADER([config.h])
AC_CONFIG_AUX_DIR(.)

AM_INIT_AUTOMAKE([dist-bzip2])
AM_MAINTAINER_MODE

AS_IF([test "$CFLAGS" = ""], [], [_cflags_is_set=yes])
AC_PROG_CC
AC_PROG_INSTALL
AC_CANONICAL_HOST
AC_PROG_LIBTOOL
AM_PROG_CC_C_O
AC_C_BIGENDIAN
AC_PATH_PROGS(PYTHON, python2 python)

CAC_LT_VERSION=m4_format("%d:%d:%d", 1, 0, 2)
AC_SUBST(CAC_LT_VERSION)

dnl =========================================================================
dnl Check deps

CAC_CARD_NONPKGCONFIG_LIBS+=" -pthread"

CAC_CARD_REQUIRES=""

PKG_CHECK_MODULES(NSS, nss)
AC_SUBST(NSS_CFLAGS)
AC_SUBST(NSS_LIBS)
CAC_CARD_REQUIRES+=" nss"


AS_IF([test "$_cflags_is_set" = "yes"], [], [
    CFLAGS="-g -O2 -Wall -Werror"
])


AS_IF([test "$_cxxflags_is_set" = "yes"], [], [
    CXXFLAGS="-g -O2 -Wall -Werror"
])

dnl Use lots of warning flags with with gcc and compatible compilers

dnl Note: if you change the following variable, the cache is automatically
dnl skipped and all flags rechecked.  So there's no need to do anything
dnl else.  If for any reason you need to force a recheck, just change
dnl MAYBE_WARN in an ignorable way (like adding whitespace)

dnl MAYBE_WARN="-Wall -Wno-sign-compare -Werror -Wno-deprecated-declarations"

MAYBE_WARN="-Wall -Wno-sign-compare -Wno-deprecated-declarations"

AC_ARG_ENABLE(werror,
AC_HELP_STRING([--enable-werror], [Use -Werror (if supported)]),
set_werror="$enableval",[
if test -f $srcdir/GITVERSION; then
	is_git_version=true
	set_werror=yes
else
	set_werror=no
fi
])

dnl handle the passthru option. passthru allows you to access the cards directly
AC_ARG_ENABLE(passthru,
AC_HELP_STRING([--enable-passthru], [allow passthru mode]),
set_passthru="$enableval",)

if test "${set_passthru}" = "yes" ; then
PKG_CHECK_MODULES(PCSC,libpcsclite)
AC_SUBST(PCSC_CFLAGS)
AC_SUBST(PCSC_LIBS)
CAC_CARD_REQUIRES+=" pcsc-lite"
USE_PASSTHRU=-DUSE_PASSTHRU
AC_SUBST(USE_PASSTHRU)
fi

AC_SUBST(CAC_COMMON_SRCDIR)
AC_SUBST(CAC_CARD_REQUIRES)
AC_SUBST(CAC_NONPKGCONFIG_CFLAGS)
AC_SUBST(CAC_CARD_NONPKGCONFIG_LIBS)

AC_OUTPUT([
Makefile
libcacard.pc
])

dnl ==========================================================================
echo "

        libcacard $VERSION
        ==============

        prefix:                   ${prefix}
        c compiler:               ${CC}

        Now type 'make' to build $PACKAGE
"
