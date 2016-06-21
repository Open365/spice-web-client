/*
 Copyright (c) 2016 eyeOS

 This file is part of Open365.

 Open365 is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// These tables map the js keyboard keys to the spice equivalent
wdi.KeymapObjES = function() {
	var charmapES = {};
	charmapES['0']   = {"prefix":[],"main":[[11,0,0,0],[139,0,0,0]],"suffix":[]};
	charmapES['1']   = {"prefix":[],"main":[[2,0,0,0],[130,0,0,0]],"suffix":[]};
	charmapES['2']   = {"prefix":[],"main":[[3,0,0,0],[131,0,0,0]],"suffix":[]};
	charmapES['3']   = {"prefix":[],"main":[[4,0,0,0],[132,0,0,0]],"suffix":[]};
	charmapES['4']   = {"prefix":[],"main":[[5,0,0,0],[133,0,0,0]],"suffix":[]};
	charmapES['5']   = {"prefix":[],"main":[[6,0,0,0],[134,0,0,0]],"suffix":[]};
	charmapES['6']   = {"prefix":[],"main":[[7,0,0,0],[135,0,0,0]],"suffix":[]};
	charmapES['7']   = {"prefix":[],"main":[[8,0,0,0],[136,0,0,0]],"suffix":[]};
	charmapES['8']   = {"prefix":[],"main":[[9,0,0,0],[137,0,0,0]],"suffix":[]};
	charmapES['9']   = {"prefix":[],"main":[[10,0,0,0],[138,0,0,0]],"suffix":[]};
	charmapES['º']   = {"prefix":[],"main":[[41,0,0,0],[169,0,0,0]],"suffix":[]};
	charmapES['ª']   = {"prefix":[[42,0,0,0]],"main":[[41,0,0,0],[169,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['\\']   = {"prefix":[[224,56,0,0]],"main":[[41,0,0,0],[169,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['!']   = {"prefix":[[42,0,0,0]],"main":[[2,0,0,0],[130,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['|']   = {"prefix":[[224,56,0,0]],"main":[[2,0,0,0],[130,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['"']   = {"prefix":[[42,0,0,0]],"main":[[3,0,0,0],[131,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['@']   = {"prefix":[[224,56,0,0]],"main":[[3,0,0,0],[131,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['·']   = {"prefix":[[42,0,0,0]],"main":[[4,0,0,0],[132,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['#']   = {"prefix":[[224,56,0,0]],"main":[[4,0,0,0],[132,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['$']   = {"prefix":[[42,0,0,0]],"main":[[5,0,0,0],[133,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['~']   = {"prefix":[[224,56,0,0]],"main":[[5,0,0,0],[133,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['%']   = {"prefix":[[42,0,0,0]],"main":[[6,0,0,0],[134,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['&']   = {"prefix":[[42,0,0,0]],"main":[[7,0,0,0],[135,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['¬']   = {"prefix":[[224,56,0,0]],"main":[[7,0,0,0],[135,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['/']   = {"prefix":[[42,0,0,0]],"main":[[8,0,0,0],[136,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['(']   = {"prefix":[[42,0,0,0]],"main":[[9,0,0,0],[137,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES[')']   = {"prefix":[[42,0,0,0]],"main":[[10,0,0,0],[138,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['=']   = {"prefix":[[42,0,0,0]],"main":[[11,0,0,0],[139,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['\'']   = {"prefix":[],"main":[[12,0,0,0],[140,0,0,0]],"suffix":[]};
	charmapES['?']   = {"prefix":[[42,0,0,0]],"main":[[12,0,0,0],[140,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['¡']   = {"prefix":[],"main":[[13,0,0,0],[141,0,0,0]],"suffix":[]};
	charmapES['¿']   = {"prefix":[[42,0,0,0]],"main":[[13,0,0,0],[141,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['q']   = {"prefix":[],"main":[[16,0,0,0],[144,0,0,0]],"suffix":[]};
	charmapES['Q']   = {"prefix":[[42,0,0,0]],"main":[[16,0,0,0],[144,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['w']   = {"prefix":[],"main":[[17,0,0,0],[145,0,0,0]],"suffix":[]};
	charmapES['W']   = {"prefix":[[42,0,0,0]],"main":[[17,0,0,0],[145,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['e']   = {"prefix":[],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[]};
	charmapES['E']   = {"prefix":[[42,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['€']   = {"prefix":[[224,56,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['r']   = {"prefix":[],"main":[[19,0,0,0],[147,0,0,0]],"suffix":[]};
	charmapES['R']   = {"prefix":[[42,0,0,0]],"main":[[19,0,0,0],[147,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['t']   = {"prefix":[],"main":[[20,0,0,0],[148,0,0,0]],"suffix":[]};
	charmapES['T']   = {"prefix":[[42,0,0,0]],"main":[[20,0,0,0],[148,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['y']   = {"prefix":[],"main":[[21,0,0,0],[149,0,0,0]],"suffix":[]};
	charmapES['Y']   = {"prefix":[[42,0,0,0]],"main":[[21,0,0,0],[149,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['u']   = {"prefix":[],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[]};
	charmapES['U']   = {"prefix":[[42,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['i']   = {"prefix":[],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[]};
	charmapES['I']   = {"prefix":[[42,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['o']   = {"prefix":[],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[]};
	charmapES['O']   = {"prefix":[[42,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['p']   = {"prefix":[],"main":[[25,0,0,0],[153,0,0,0]],"suffix":[]};
	charmapES['P']   = {"prefix":[[42,0,0,0]],"main":[[25,0,0,0],[153,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['`']   = {"prefix":[[26,0,0,0],[154,0,0,0],[57,0,0,0],[185,0,0,0]],"main":[],"suffix":[]};
	charmapES['´']   = {"prefix":[[40,0,0,0],[168,0,0,0],[57,0,0,0],[185,0,0,0]],"main":[],"suffix":[]};
	charmapES['¨']   = {"prefix":[[40,0,0,0],[168,0,0,0],[42,0,0,0],[170,0,0,0],[57,0,0,0],[185,0,0,0]],"main":[],"suffix":[]};
	charmapES['à']   = {"prefix":[[26,0,0,0],[154,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[]};
	charmapES['À']   = {"prefix":[[26,0,0,0],[154,0,0,0],[42,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['è']   = {"prefix":[[26,0,0,0],[154,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[]};
	charmapES['È']   = {"prefix":[[26,0,0,0],[154,0,0,0],[42,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ì']   = {"prefix":[[26,0,0,0],[154,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[]};
	charmapES['Ì']   = {"prefix":[[26,0,0,0],[154,0,0,0],[42,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ò']   = {"prefix":[[26,0,0,0],[154,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[]};
	charmapES['Ò']   = {"prefix":[[26,0,0,0],[154,0,0,0],[42,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ù']   = {"prefix":[[26,0,0,0],[154,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[]};
	charmapES['Ù']   = {"prefix":[[26,0,0,0],[154,0,0,0],[42,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['â']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0],[170,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[]};
	charmapES['Â']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ê']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0],[170,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[]};
	charmapES['Ê']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['î']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0],[170,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[]};
	charmapES['Î']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ô']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0],[170,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[]};
	charmapES['Ô']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['û']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0],[170,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[]};
	charmapES['Û']   = {"prefix":[[42,0,0,0],[26,0,0,0],[154,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['^']   = {"prefix":[[42,0,0,0]],"main":[[26,0,0,0],[154,0,0,0]],"suffix":[[170,0,0,0],[57,0,0,0],[185,0,0,0]]};
	charmapES['[']   = {"prefix":[[224,56,0,0],[26,0,0,0],[154,0,0,0],[224,184,0,0]],"main":[],"suffix":[]};
	charmapES['+']   = {"prefix":[],"main":[[27,0,0,0],[155,0,0,0]],"suffix":[]};
	charmapES['*']   = {"prefix":[[42,0,0,0]],"main":[[27,0,0,0],[155,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES[']']   = {"prefix":[[224,56,0,0]],"main":[[27,0,0,0],[155,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['a']   = {"prefix":[],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[]};
	charmapES['A']   = {"prefix":[[42,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['s']   = {"prefix":[],"main":[[31,0,0,0],[159,0,0,0]],"suffix":[]};
	charmapES['S']   = {"prefix":[[42,0,0,0]],"main":[[31,0,0,0],[159,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['d']   = {"prefix":[],"main":[[32,0,0,0],[160,0,0,0]],"suffix":[]};
	charmapES['D']   = {"prefix":[[42,0,0,0]],"main":[[32,0,0,0],[160,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['f']   = {"prefix":[],"main":[[33,0,0,0],[161,0,0,0]],"suffix":[]};
	charmapES['F']   = {"prefix":[[42,0,0,0]],"main":[[33,0,0,0],[161,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['g']   = {"prefix":[],"main":[[34,0,0,0],[162,0,0,0]],"suffix":[]};
	charmapES['G']   = {"prefix":[[42,0,0,0]],"main":[[34,0,0,0],[162,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['h']   = {"prefix":[],"main":[[35,0,0,0],[163,0,0,0]],"suffix":[]};
	charmapES['H']   = {"prefix":[[42,0,0,0]],"main":[[35,0,0,0],[163,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['j']   = {"prefix":[],"main":[[36,0,0,0],[164,0,0,0]],"suffix":[]};
	charmapES['J']   = {"prefix":[[42,0,0,0]],"main":[[36,0,0,0],[164,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['k']   = {"prefix":[],"main":[[37,0,0,0],[165,0,0,0]],"suffix":[]};
	charmapES['K']   = {"prefix":[[42,0,0,0]],"main":[[37,0,0,0],[165,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['l']   = {"prefix":[],"main":[[38,0,0,0],[166,0,0,0]],"suffix":[]};
	charmapES['L']   = {"prefix":[[42,0,0,0]],"main":[[38,0,0,0],[166,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ñ']   = {"prefix":[],"main":[[39,0,0,0],[167,0,0,0]],"suffix":[]};
	charmapES['Ñ']   = {"prefix":[[42,0,0,0]],"main":[[39,0,0,0],[167,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['á']   = {"prefix":[[40,0,0,0],[168,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[]};
	charmapES['Á']   = {"prefix":[[40,0,0,0],[168,0,0,0],[42,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['é']   = {"prefix":[[40,0,0,0],[168,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[]};
	charmapES['É']   = {"prefix":[[40,0,0,0],[168,0,0,0],[42,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['í']   = {"prefix":[[40,0,0,0],[168,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[]};
	charmapES['Í']   = {"prefix":[[40,0,0,0],[168,0,0,0],[42,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ó']   = {"prefix":[[40,0,0,0],[168,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[]};
	charmapES['Ó']   = {"prefix":[[40,0,0,0],[168,0,0,0],[42,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ú']   = {"prefix":[[40,0,0,0],[168,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[]};
	charmapES['Ú']   = {"prefix":[[40,0,0,0],[168,0,0,0],[42,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ä']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0],[170,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[]};
	charmapES['Ä']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0]],"main":[[30,0,0,0],[158,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ë']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0],[170,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[]};
	charmapES['Ë']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0]],"main":[[18,0,0,0],[146,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ï']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0],[170,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[]};
	charmapES['Ï']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0]],"main":[[23,0,0,0],[151,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ö']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0],[170,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[]};
	charmapES['Ö']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0]],"main":[[24,0,0,0],[152,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['ü']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0],[170,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[]};
	charmapES['Ü']   = {"prefix":[[42,0,0,0],[40,0,0,0],[168,0,0,0]],"main":[[22,0,0,0],[150,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['{']   = {"prefix":[[224,56,0,0],[40,0,0,0],[168,0,0,0],[224,184,0,0]],"main":[],"suffix":[]};
	charmapES['ç']   = {"prefix":[],"main":[[43,0,0,0],[171,0,0,0]],"suffix":[]};
	charmapES['Ç']   = {"prefix":[[42,0,0,0]],"main":[[43,0,0,0],[171,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['}']   = {"prefix":[[224,56,0,0]],"main":[[43,0,0,0],[171,0,0,0]],"suffix":[[224,184,0,0]]};
	charmapES['<']   = {"prefix":[],"main":[[86,0,0,0],[214,0,0,0]],"suffix":[]};
	charmapES['>']   = {"prefix":[[42,0,0,0]],"main":[[86,0,0,0],[214,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['z']   = {"prefix":[],"main":[[44,0,0,0],[172,0,0,0]],"suffix":[]};
	charmapES['Z']   = {"prefix":[[42,0,0,0]],"main":[[44,0,0,0],[172,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['x']   = {"prefix":[],"main":[[45,0,0,0],[173,0,0,0]],"suffix":[]};
	charmapES['X']   = {"prefix":[[42,0,0,0]],"main":[[45,0,0,0],[173,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['c']   = {"prefix":[],"main":[[46,0,0,0],[174,0,0,0]],"suffix":[]};
	charmapES['C']   = {"prefix":[[42,0,0,0]],"main":[[46,0,0,0],[174,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['v']   = {"prefix":[],"main":[[47,0,0,0],[175,0,0,0]],"suffix":[]};
	charmapES['V']   = {"prefix":[[42,0,0,0]],"main":[[47,0,0,0],[175,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['b']   = {"prefix":[],"main":[[48,0,0,0],[176,0,0,0]],"suffix":[]};
	charmapES['B']   = {"prefix":[[42,0,0,0]],"main":[[48,0,0,0],[176,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['n']   = {"prefix":[],"main":[[49,0,0,0],[177,0,0,0]],"suffix":[]};
	charmapES['N']   = {"prefix":[[42,0,0,0]],"main":[[49,0,0,0],[177,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['m']   = {"prefix":[],"main":[[50,0,0,0],[178,0,0,0]],"suffix":[]};
	charmapES['M']   = {"prefix":[[42,0,0,0]],"main":[[50,0,0,0],[178,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES[',']   = {"prefix":[],"main":[[51,0,0,0],[179,0,0,0]],"suffix":[]};
	charmapES[';']   = {"prefix":[[42,0,0,0]],"main":[[51,0,0,0],[179,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['.']   = {"prefix":[],"main":[[52,0,0,0],[180,0,0,0]],"suffix":[]};
	charmapES[':']   = {"prefix":[[42,0,0,0]],"main":[[52,0,0,0],[180,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES['-']   = {"prefix":[],"main":[[53,0,0,0],[181,0,0,0]],"suffix":[]};
	charmapES['_']   = {"prefix":[[42,0,0,0]],"main":[[53,0,0,0],[181,0,0,0]],"suffix":[[170,0,0,0]]};
	charmapES[' ']   = {"prefix":[[57,0,0,0],[185,0,0,0]],"main":[],"suffix":[]};



	function getPrefix (char) {
		var prefix = charmapES[char].prefix;
		return prefix || [];
	}

	function getSufix (char) {
		var suffix = charmapES[char].suffix;
		return suffix || [];
	}

	function getVal (char) {
		var res = [];
		var prefix = getPrefix(char);
		if (prefix.length > 0) {
			res = res.concat(prefix);
		}
		var main = charmapES[char].main;
		res = res.concat(main);

		var suffix = getSufix(char);
		if (suffix.length > 0) {
			res = res.concat(suffix);
		}

		return res;
	}
	return {
		getVal: getVal,
		getCharmap: function() {
			return charmapES;
		}
	};
}( );
