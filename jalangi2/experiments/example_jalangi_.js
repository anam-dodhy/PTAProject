J$.iids = {"8":[10,7,10,16],"9":[2,3,2,10],"10":[9,17,9,23],"16":[9,17,9,23],"17":[2,15,2,20],"18":[9,25,9,28],"25":[2,3,2,21],"27":[2,3,2,14],"33":[2,3,2,22],"34":[9,25,9,28],"41":[1,1,3,2],"42":[10,7,10,10],"49":[1,1,3,2],"50":[10,7,10,16],"57":[6,3,6,10],"65":[6,15,6,20],"73":[6,3,6,21],"75":[6,3,6,14],"81":[6,3,6,22],"89":[5,1,7,2],"97":[5,1,7,2],"105":[9,14,9,15],"113":[9,14,9,15],"121":[9,14,9,15],"129":[9,17,9,18],"137":[9,21,9,23],"153":[9,25,9,26],"161":[9,25,9,28],"177":[10,7,10,8],"185":[10,9,10,10],"193":[10,15,10,16],"201":[11,5,11,8],"209":[11,5,11,10],"217":[11,5,11,11],"225":[13,5,13,8],"233":[13,5,13,10],"241":[13,5,13,11],"249":[16,1,16,8],"257":[16,13,16,19],"265":[16,1,16,20],"267":[16,1,16,12],"273":[16,1,16,21],"281":[1,1,16,21],"289":[1,1,3,2],"297":[1,1,16,21],"305":[5,1,7,2],"313":[1,1,16,21],"321":[1,1,16,21],"329":[1,1,3,2],"337":[1,1,3,2],"345":[5,1,7,2],"353":[5,1,7,2],"361":[10,3,14,4],"369":[9,1,15,2],"377":[9,1,15,2],"385":[1,1,16,21],"393":[1,1,16,21],"nBranches":4,"originalCodeFileName":"E:\\TUD\\PTA\\Project\\jalangi2\\experiments\\example.js","instrumentedCodeFileName":"E:\\TUD\\PTA\\Project\\jalangi2\\experiments\\example_jalangi_.js","code":"function foo(){\r\n  console.log(\"foo\");\r\n}\r\n\r\nfunction bar(){\r\n  console.log(\"bar\");\r\n}\r\n\r\nfor (var i = 0; i < 10; i++){\r\n  if (i%2 === 0){\r\n    foo();\r\n  } else {\r\n    bar();\r\n  }\r\n}\r\nconsole.log(\"done\");"};
jalangiLabel2:
    while (true) {
        try {
            J$.Se(281, 'E:\\TUD\\PTA\\Project\\jalangi2\\experiments\\example_jalangi_.js', 'E:\\TUD\\PTA\\Project\\jalangi2\\experiments\\example.js');
            function foo() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(41, arguments.callee, this, arguments);
                            arguments = J$.N(49, 'arguments', arguments, 4);
                            J$.X1(33, J$.M(25, J$.R(9, 'console', console, 2), 'log', 0)(J$.T(17, "foo", 21, false)));
                        } catch (J$e) {
                            J$.Ex(329, J$e);
                        } finally {
                            if (J$.Fr(337))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            function bar() {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(89, arguments.callee, this, arguments);
                            arguments = J$.N(97, 'arguments', arguments, 4);
                            J$.X1(81, J$.M(73, J$.R(57, 'console', console, 2), 'log', 0)(J$.T(65, "bar", 21, false)));
                        } catch (J$e) {
                            J$.Ex(345, J$e);
                        } finally {
                            if (J$.Fr(353))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }
            foo = J$.N(297, 'foo', J$.T(289, foo, 12, false, 41), 0);
            bar = J$.N(313, 'bar', J$.T(305, bar, 12, false, 89), 0);
            J$.N(321, 'i', i, 0);
            for (var i = J$.X1(121, J$.W(113, 'i', J$.T(105, 0, 22, false), i, 3)); J$.X1(369, J$.C(16, J$.B(10, '<', J$.R(129, 'i', i, 1), J$.T(137, 10, 22, false), 0))); J$.X1(377, J$.B(34, '-', i = J$.W(161, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(153, 'i', i, 1)), J$.T(145, 1, 22, false), 0), i, 2), J$.T(169, 1, 22, false), 0))) {
                if (J$.X1(361, J$.C(8, J$.B(50, '===', J$.B(42, '%', J$.R(177, 'i', i, 1), J$.T(185, 2, 22, false), 0), J$.T(193, 0, 22, false), 0)))) {
                    J$.X1(217, J$.F(209, J$.R(201, 'foo', foo, 1), 0)());
                } else {
                    J$.X1(241, J$.F(233, J$.R(225, 'bar', bar, 1), 0)());
                }
            }
            J$.X1(273, J$.M(265, J$.R(249, 'console', console, 2), 'log', 0)(J$.T(257, "done", 21, false)));
        } catch (J$e) {
            J$.Ex(385, J$e);
        } finally {
            if (J$.Sr(393)) {
                J$.L();
                continue jalangiLabel2;
            } else {
                J$.L();
                break jalangiLabel2;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
