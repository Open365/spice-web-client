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

window.performanceTest = window.performanceTest || {};

performanceTest.data = {
	setup: [
		"specialCharDown:meta",
		"specialCharUp:meta",
		"timeout:500",
		"text:word 2010",
		"specialCharDown:enter",
		"specialCharUp:enter",
		"timeout:5000",
		"specialCharDown:alt",
		"specialCharUp:alt",
		"key:f",
		"key:o",
		"timeout:1500",
		"text:scroll.docx",
		"specialCharDown:enter",
		"specialCharUp:enter",
		"timeout:500",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollDown"
	],
	teardown: [
		"specialCharDown:alt",
		"specialCharUp:alt",
		"key:f",
		"key:x"
	],
	test: [
		"mouseMove:300,300",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp",
		"scrollDown",
		"scrollDown",
		"scrollDown",
		"scrollUp",
		"scrollUp",
		"scrollUp"
	]
};
