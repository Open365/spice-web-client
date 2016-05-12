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

// The following results in 'hello [MANGLED]'
//
// Filed as https://github.com/ry/node/issues/issue/402

var sys = require("sys"),
    buf = new Buffer(1024), len,
    str1 = "aGVsbG8g",  // 'hello '
    str2 = "d29ybGQ=",  // 'world'

len = buf.write(str1, 0, 'base64');
len += buf.write(str2, len, 'base64');
sys.log("decoded result: " + buf.toString('binary', 0, len));
