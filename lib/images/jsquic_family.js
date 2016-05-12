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

function golomb_code_len(n, l) {
    if (n < wdi.nGRcodewords[l]) {
        return (n >>> l) + 1 + l;
    } else {
        return wdi.notGRcwlen[l];
    }
}

function golomb_decoding(l, bits, bppmask) {
	var cwlen;
	var result;
    if (bits > wdi.notGRprefixmask[l]) {
        var zeroprefix = cnt_l_zeroes(bits);
        cwlen = zeroprefix + 1 + l;            
        result = ( (zeroprefix << l) >>> 0) | ((bits >>> (32 - cwlen)) & bppmask[l]);
    } else {
        cwlen = wdi.notGRcwlen[l];
        result = wdi.nGRcodewords[l] + ((bits) >>> (32 - cwlen) & bppmask[wdi.notGRsuffixlen[l]]);
    }
	return [result,cwlen];
}

/* update the bucket using just encoded curval */
function real_update_model(state, bucket, curval, bpp) {
    var i;
    var bestcode;
    var bestcodelen;
	var ithcodelen;

	var pcounters = bucket.pcounters;
    bestcode = bpp - 1;
    bestcodelen = (pcounters[bestcode] += golomb_code_len(curval, bestcode));

    for (i = bpp - 2; i >= 0; i--) {
        ithcodelen = (pcounters[i] += golomb_code_len(curval, i));

        if (ithcodelen < bestcodelen) {
            bestcode = i;
            bestcodelen = ithcodelen;
        }
    }

    bucket.bestcode = bestcode;
    if (bestcodelen > state.wm_trigger) {
        for (i = 0; i < bpp; i++) {
            pcounters[i] >>>= 1;
        }
    }
}

function UPDATE_MODEL(index, encoder, bpp, correlate_row_r, correlate_row_g, correlate_row_b) {
    real_update_model(encoder.rgb_state, find_bucket(encoder.channels[0], 
		correlate_row_r[index - 1]), correlate_row_r[index], bpp);
    real_update_model(encoder.rgb_state, find_bucket(encoder.channels[1], 
		correlate_row_g[index - 1]), correlate_row_g[index], bpp);
    real_update_model(encoder.rgb_state, find_bucket(encoder.channels[2], 
		correlate_row_b[index - 1]), correlate_row_b[index], bpp);
}

function find_bucket(channel, val) {
	if(val===undefined) {
		val=channel.oldFirst;
	}
    return channel._buckets_ptrs[val];
}