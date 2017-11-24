J$.iids = {"9":[3,9,3,10],"10":[3,9,3,14],"17":[3,13,3,14],"25":[3,9,3,14],"33":[3,2,3,15],"41":[2,2,4,3],"49":[2,2,4,3],"57":[5,9,5,10],"65":[5,9,5,12],"73":[5,9,5,12],"81":[5,2,5,13],"89":[1,1,6,2],"97":[1,1,6,2],"105":[1,1,6,2],"113":[2,2,4,3],"121":[1,1,6,2],"129":[7,1,7,2],"137":[7,3,7,9],"145":[7,1,7,10],"153":[7,1,7,11],"161":[1,1,8,1],"169":[1,1,6,2],"177":[1,1,8,1],"185":[2,2,4,3],"193":[2,2,4,3],"201":[1,1,6,2],"209":[1,1,6,2],"217":[1,1,8,1],"225":[1,1,8,1],"nBranches":0,"originalCodeFileName":"E:\\TUD\\PTA\\PTAProject\\jalangi2\\experiments\\hoistedExample.js","instrumentedCodeFileName":"E:\\TUD\\PTA\\PTAProject\\jalangi2\\experiments\\hoistedExample_jalangi_.js","code":"function f(a) {\r\n function g() {\r\n\treturn a + 1;\r\n }\r\n return g();\r\n}\r\nf(\"test\");\r\n"};
jalangiLabel2:
    while (true) {
        try {
            J$.Se(161, 'E:\\TUD\\PTA\\PTAProject\\jalangi2\\experiments\\hoistedExample_jalangi_.js', 'E:\\TUD\\PTA\\PTAProject\\jalangi2\\experiments\\hoistedExample.js');
            function f(a) {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(89, arguments.callee, this, arguments);
                            function g() {
                                jalangiLabel0:
                                    while (true) {
                                        try {
                                            J$.Fe(41, arguments.callee, this, arguments);
                                            arguments = J$.N(49, 'arguments', arguments, 4);
                                            return J$.X1(33, J$.Rt(25, J$.B(10, '+', J$.R(9, 'a', a, 0), J$.T(17, 1, 22, false), 0)));
                                        } catch (J$e) {
                                            J$.Ex(185, J$e);
                                        } finally {
                                            if (J$.Fr(193))
                                                continue jalangiLabel0;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }
                            arguments = J$.N(97, 'arguments', arguments, 4);
                            a = J$.N(105, 'a', a, 4);
                            g = J$.N(121, 'g', J$.T(113, g, 12, false, 41), 0);
                            return J$.X1(81, J$.Rt(73, J$.F(65, J$.R(57, 'g', g, 0), 0)()));
                        } catch (J$e) {
                            J$.Ex(201, J$e);
                        } finally {
                            if (J$.Fr(209))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }
            f = J$.N(177, 'f', J$.T(169, f, 12, false, 89), 0);
            J$.X1(153, J$.F(145, J$.R(129, 'f', f, 1), 0)(J$.T(137, "test", 21, false)));
        } catch (J$e) {
            J$.Ex(217, J$e);
        } finally {
            if (J$.Sr(225)) {
                J$.L();
                continue jalangiLabel2;
            } else {
                J$.L();
                break jalangiLabel2;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
