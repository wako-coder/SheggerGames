var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function(g) {
    var q = function() {};
    q.prototype = g;
    return new q
};
$jscomp.underscoreProtoCanBeSet = function() {
    var g = {
            a: !0
        },
        q = {};
    try {
        return q.__proto__ = g, q.a
    } catch (w) {}
    return !1
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(g, q) {
    g.__proto__ = q;
    if (g.__proto__ !== q) throw new TypeError(g + " is not extensible");
    return g
} : null;
$jscomp.inherits = function(g, q) {
    g.prototype = $jscomp.objectCreate(q.prototype);
    g.prototype.constructor = g;
    if ($jscomp.setPrototypeOf) {
        var w = $jscomp.setPrototypeOf;
        w(g, q)
    } else
        for (w in q)
            if ("prototype" != w)
                if (Object.defineProperties) {
                    var D = Object.getOwnPropertyDescriptor(q, w);
                    D && Object.defineProperty(g, w, D)
                } else g[w] = q[w];
    g.superClass_ = q.prototype
};
var Game = function() {
    return Phaser.Scene.call(this, "game") || this
};
$jscomp.inherits(Game, Phaser.Scene);
Game.prototype.create = function() {
    function g(a, b, c) {
        var d = n.add.sprite(a, b, "obj" + c);
        n.tweens.add({
            targets: d,
            scaleY: 0,
            scaleX: 0,
            duration: 150,
            ease: "Linear",
            onComplete: function() {
                d.destroy(!0, !0)
            }
        })
    }

    function q(a) {
        for (var b = a.length, c, d; b;) d = Math.floor(Math.random() * b--), c = a[b], a[b] = a[d], a[d] = c;
        return a
    }

    function w() {
        l && (l.clearTint(), l = null);
        for (var a = [], b = t.getLength(), c = t.getChildren(), d = 0; 10 > d; d++)
            for (var e = 0; 8 > e; e++) k[d][e].filled && a.push(k[d][e].color);
        q(a);
        for (d = 0; d < b; d++) e = c[d], e.color = a[d], e.setTexture("obj" +
            e.color);
        R();
        E() ? setTimeout(function() {
            play_sound("shuffle", n)
        }, 200) : (console.log("not match"), w())
    }

    function D() {
        var a = t.getLength(),
            b = t.getChildren(),
            c = E();
        if (c) {
            B = c;
            for (var d = 0; d < a; d++) {
                var e = b[d];
                e.pos.x === c[1].x && e.pos.y === c[0].y && (l = e, e.setTint(5233606), z.setVisible(!0), z.setPosition(e.x, e.y));
                if (e.pos.x === c[1].x && e.pos.y === c[1].y) {
                    e.setTint(5233606);
                    var f = e
                }
            }
            f && (v = "wait1", player_data.score += 2, S.setText(player_data.score), z.setVisible(!1), a = N(l.pos, f.pos), T(a), k[f.pos.y][f.pos.x].filled = !1, k[l.pos.y][l.pos.x].filled = !1, setTimeout(function() {
                v = "wait";
                g(f.x, f.y, f.color);
                g(l.x, l.y, l.color);
                f.destroy(!0, !0);
                l.destroy(!0, !0);
                l = null;
                setTimeout(function() {
                    U()
                }, 100);
                O()
            }, 300))
        }
    }

    function Z() {
        var a = t.getLength(),
            b = t.getChildren(),
            c = E();
        if (c) {
            B = c;
            for (var d = 0; d < a; d++) {
                var e = b[d];
                (e.pos.x === c[0].x && e.pos.y === c[0].y || e.pos.x === c[1].x && e.pos.y === c[1].y) && e.setTint(5233606)
            }
        } else alert("err");
        setTimeout(function() {
            play_sound("hint", n)
        }, 200)
    }

    function E() {
        for (var a = t.getLength(), b = t.getChildren(), c = 0; c < a; c++) {
            var d = b[c];
            a: {
                var e =
                    d.pos;
                for (var f = k[e.y][e.x].color, g = 0; 10 > g; g++)
                    for (var h = 0; 8 > h; h++)
                        if ((g !== e.y || h !== e.x) && k[g][h].filled && k[g][h].color === f && N(e, {
                                x: h,
                                y: g
                            })) {
                            e = {
                                x: h,
                                y: g
                            };
                            break a
                        }
                e = !1
            }
            if (e) return [d.pos, e]
        }
        return !1
    }

    function U() {
        if (1 === player_data.drop_mode) var a = "down";
        else if (2 === player_data.drop_mode) a = "up";
        else if (3 === player_data.drop_mode) a = "left";
        else if (4 === player_data.drop_mode) a = "right";
        else if (5 === player_data.drop_mode) 0 === m ? a = "down" : 1 === m && (a = "up"), m++, 1 < m && (m = 0);
        else if (6 === player_data.drop_mode) 0 === m ? a =
            "left" : 1 === m && (a = "right"), m++, 1 < m && (m = 0);
        else if (7 === player_data.drop_mode) 0 === m ? a = "up" : 1 === m && (a = "right"), m++, 1 < m && (m = 0);
        else if (8 === player_data.drop_mode) 0 === m ? a = "down" : 1 === m && (a = "left"), m++, 1 < m && (m = 0);
        else if (9 === player_data.drop_mode) 0 === m ? a = "up" : 1 === m ? a = "right" : 2 === m ? a = "down" : 3 === m && (a = "left"), m++, 3 < m && (m = 0);
        else if (9 < player_data.drop_mode) {
            var b = Math.floor(4 * Math.random());
            0 === b ? a = "up" : 1 === b ? a = "right" : 2 === b ? a = "down" : 3 === b && (a = "left")
        }
        b = a;
        a = 0;
        if ("down" === b)
            for (b = 0; 8 > b; b++)
                for (var c = 0, d = 9; 0 <=
                    d; d--) k[d][b].filled ? (0 != c && a++, k[d][b].to = {
                    x: 0,
                    y: c
                }) : c++;
        else if ("up" === b)
            for (b = 0; 8 > b; b++)
                for (d = c = 0; 10 > d; d++) k[d][b].filled ? (0 != c && a++, k[d][b].to = {
                    x: 0,
                    y: c
                }) : c--;
        else if ("left" === b)
            for (b = 0; 10 > b; b++)
                for (d = c = 0; 8 > d; d++) k[b][d].filled ? (0 != c && a++, k[b][d].to = {
                    x: c,
                    y: 0
                }) : c--;
        else if ("right" === b)
            for (b = 0; 10 > b; b++)
                for (c = 0, d = 7; 0 <= d; d--) k[b][d].filled ? (0 != c && a++, k[b][d].to = {
                    x: c,
                    y: 0
                }) : c++;
        if (a) {
            b = t.getLength();
            c = t.getChildren();
            for (var e = d = 0; 10 > e; e++)
                for (var f = 0; 8 > f; f++)
                    if (k[e][f].filled) {
                        d++;
                        var g = 0;
                        a: for (; g <
                            b; g++) {
                            var h = c[g];
                            if (h.pos.x === f && h.pos.y === e) {
                                h.depth = d;
                                break a
                            }
                        }
                    }
            aa(a)
        } else if (v = "play", !E()) {
            a: {
                for (a = 0; 10 > a; a++)
                    for (b = 0; 8 > b; b++)
                        if (k[a][b].filled) {
                            a = !1;
                            break a
                        }
                a = !0
            }
            a ? (play_sound("completed", n), v = "bonus", a = "hint", 1 === Math.floor(2 * Math.random()) && (a = "shuffle"), "hint" === a ? player_data.hint_left++ : "shuffle" === a && player_data.shuffle_left++, n.add.rectangle(0, 0, config.width, config.height, 0).setOrigin(0).alpha = .8, n.add.text(360, 320, "Selamat", {
                fontFamily: "robotomono",
                fontSize: 65,
                align: "center",
                color: "#FFFFFF"
            }).setOrigin(.5), n.add.sprite(360, 480, a + "_icon"), n.add.text(360, 600, "+1", {
                fontFamily: "PoetsenOne",
                fontSize: 75,
                align: "center",
                color: "#FFFFFF"
            }).setOrigin(.5), draw_button(360, 700, "next", n), last_array = null, player_data.drop_mode++, k = null, V()) : 0 < player_data.shuffle_left ? (C.setVisible(!0), play_sound("nomatch", n)) : (v = "gameover1", setTimeout(W, 1E3))
        }
        V()
    }

    function aa(a) {
        v = "drop";
        for (var b = t.getLength(), c = t.getChildren(), d = 0; d < b; d++) {
            var e = c[d],
                f = k[e.pos.y][e.pos.x];
            if (0 != f.to.x || 0 != f.to.y) e.pos.x += f.to.x, e.pos.y += f.to.y, n.tweens.add({
                targets: e,
                x: G + y.width * e.pos.x,
                y: H + y.height * e.pos.y,
                duration: 200,
                ease: "Linear",
                onComplete: function() {
                    a--;
                    0 === a && (v = "play", R(), E() || (0 < player_data.shuffle_left ? (C.setVisible(!0), play_sound("nomatch", n)) : (v = "gameover1", setTimeout(W, 1E3))))
                }
            })
        }
    }

    function R() {
        for (var a = 0; 10 > a; a++)
            for (var b = 0; 8 > b; b++) k[a][b].filled = !1, k[a][b].color = 0, k[a][b].to = null;
        a = t.getLength();
        b = t.getChildren();
        for (var c = 0; c < a; c++) {
            var d = b[c];
            k[d.pos.y][d.pos.x].filled = !0;
            k[d.pos.y][d.pos.x].color = d.color
        }
    }

    function x(a) {
        return Math.PI / 180 * a
    }

    function O() {
        for (var a = I.getChildren(), b = I.getLength(), c = 0; c < b; c++) a[c].setVisible(!1)
    }

    function T(a) {
        play_sound("connected", n);
        O();
        for (var b = I.getChildren(), c, d, e = 0; e < a.length; e++) {
            var f = b[e];
            f.setVisible(!0);
            f.setPosition(G + y.width * a[e].x, H + y.height * a[e].y);
            0 === e ? d = a[e].x === a[e + 1].x ? a[e].y > a[e + 1].y ? "up" : "down" : a[e].x > a[e + 1].x ? "left" : "right" : e < a.length - 1 && (a[e].x === a[e + 1].x ? a[e].y > a[e + 1].y ? (d = "up", "up" === c ? f.setFrame(1) : "down" !==
                c && ("left" === c ? (f.setFrame(2), f.setRotation(x(180))) : "right" === c && (f.setFrame(2), f.setRotation(x(90))))) : (d = "down", "up" !== c && ("down" === c ? f.setFrame(1) : "left" === c ? (f.setFrame(2), f.setRotation(x(270))) : "right" === c && (f.setFrame(2), f.setRotation(x(0))))) : a[e].x > a[e + 1].x ? (d = "left", "up" === c ? (f.setFrame(2), f.setRotation(x(0))) : "down" === c ? (f.setFrame(2), f.setRotation(x(90))) : "left" === c && f.setFrame(1)) : (d = "right", "up" === c ? (f.setFrame(2), f.setRotation(x(270))) : "down" === c ? (f.setFrame(2), f.setRotation(x(180))) :
                "left" !== c && "right" === c && f.setFrame(1)));
            e === a.length - 1 && (d = a[e].x === a[e - 1].x ? a[e].y > a[e - 1].y ? "up" : "down" : a[e].x > a[e - 1].x ? "left" : "right", f.setFrame(0));
            0 === f.frame.name ? "up" === d ? f.setRotation(x(270)) : "down" === d ? f.setRotation(x(90)) : "left" === d ? f.setRotation(x(180)) : "right" === d && f.setRotation(x(0)) : 1 === f.frame.name && ("up" === d || "down" === d ? f.setRotation(x(90)) : f.setRotation(x(0)));
            c = d
        }
    }

    function X(a, b) {
        return 0 <= a.x && 0 <= a.y && a.x < b[0].length && a.y < b.length ? !0 : !1
    }

    function F(a, b, c, d, e) {
        for (var f = [], g = 1; 10 >
            g; g++) {
            var h = {
                x: b.x + a.x * g,
                y: b.y + a.y * g
            };
            if (X(h, d))
                if (d[h.y][h.x].filled) {
                    if (h.x === c.x && h.y === c.y) return f.push(h), f;
                    break
                } else if (f.push(h), e)
                if (1 === a.x || -1 === a.x) {
                    var k = F({
                        x: 0,
                        y: -1
                    }, h, c, d);
                    if (k) {
                        for (c = 0; c < k.length; c++) f.push(k[c]);
                        return f
                    }
                    if (h = F({
                            x: 0,
                            y: 1
                        }, h, c, d)) {
                        for (c = 0; c < h.length; c++) f.push(h[c]);
                        return f
                    }
                } else {
                    if (k = F({
                            x: -1,
                            y: 0
                        }, h, c, d)) {
                        for (c = 0; c < k.length; c++) f.push(k[c]);
                        return f
                    }
                    if (h = F({
                            x: 1,
                            y: 0
                        }, h, c, d)) {
                        for (c = 0; c < h.length; c++) f.push(h[c]);
                        return f
                    }
                }
            else if (1 === a.x || -1 === a.x) {
                if (J({
                            x: 0,
                            y: 1
                        }, h,
                        c, d)) {
                    for (a = h.y + 1; a < c.y + 1; a++) f.push({
                        x: h.x,
                        y: a
                    });
                    return f
                }
                if (J({
                        x: 0,
                        y: -1
                    }, h, c, d)) {
                    for (a = h.y - 1; a > c.y - 1; a--) f.push({
                        x: h.x,
                        y: a
                    });
                    return f
                }
            } else {
                if (J({
                        x: 1,
                        y: 0
                    }, h, c, d)) {
                    for (a = h.x + 1; a < c.x + 1; a++) f.push({
                        x: a,
                        y: h.y
                    });
                    return f
                }
                if (J({
                        x: -1,
                        y: 0
                    }, h, c, d)) {
                    for (a = h.x - 1; a > c.x - 1; a--) f.push({
                        x: a,
                        y: h.y
                    });
                    return f
                }
            }
        }
        return !1
    }

    function J(a, b, c, d) {
        for (var e = 1; 10 > e; e++) {
            var f = {
                x: b.x + a.x * e,
                y: b.y + a.y * e
            };
            if (X(f, d)) {
                if (d[f.y][f.x].filled) return f.x === c.x && f.y === c.y ? !0 : !1
            } else return !1
        }
    }

    function N(a, b) {
        for (var c = JSON.parse(JSON.stringify(k)),
                d = 0; 10 > d; d++) c[d].unshift({
            filled: !1
        }), c[d].push({
            filled: !1
        });
        d = [];
        for (var e = 0; 10 > e; e++) d.push({
            filled: !1
        });
        c.push(d);
        c.unshift(d);
        a.x++;
        a.y++;
        b.x++;
        b.y++;
        d = [];
        for (e = 0; 4 > e; e++) {
            var f = {
                x: -1,
                y: 0
            };
            1 === e ? f = {
                x: 1,
                y: 0
            } : 2 === e ? f = {
                x: 0,
                y: -1
            } : 3 === e && (f = {
                x: 0,
                y: 1
            });
            if (f = F(f, a, b, c, !0)) {
                var g = [];
                f.unshift(a);
                for (var h = 0; h < f.length; h++) g.push({
                    x: f[h].x - 1,
                    y: f[h].y - 1
                });
                d.push(g)
            }
        }
        c = null;
        e = 999;
        for (f = 0; f < d.length; f++) d[f].length < e && (e = d[f].length, c = d[f]);
        a.x--;
        a.y--;
        b.x--;
        b.y--;
        return c
    }

    function Y() {
        ba.setText(player_data.shuffle_left);
        ca.setText(player_data.hint_left)
    }

    function W() {
        play_sound("gameover", n);
        player_data.score > best_score && (best_score = player_data.score, localStorage.setItem("pplayy_onet_best", best_score));
        for (var a = t.getLength(), b = t.getChildren(), c = 0; 10 > c; c++)
            for (var d = 0; 8 > d; d++)
                if (k[c][d].filled) {
                    var e = 0;
                    a: for (; e < a; e++) {
                        var f = b[e];
                        if (f.pos.x === d && f.pos.y === c) {
                            f.depth = 0;
                            break a
                        }
                    }
                }
        v = "gameover";
        n.add.rectangle(0, 0, config.width, config.height, 0).setOrigin(0).alpha = .8;
        n.add.text(360, 400, "Selesai", {
            fontFamily: "PoetsenOne",
            fontSize: 65,
            align: "center",
            color: "#FFFFFF"
        }).setOrigin(.5);
        n.add.text(360, 480, "Skor: " + player_data.score, {
            fontFamily: "PoetsenOne",
            fontSize: 45,
            align: "center",
            color: "#FFFFFF"
        }).setOrigin(.5);
        draw_button(360, 610, "restart", n);
        draw_button(360, 700, "menu", n);
        localStorage.removeItem("pplayy_onet_array");
        player_data.drop_mode = 0;
        player_data.score = 0;
        last_array = null;
        localStorage.setItem("pplayy_onet_data", JSON.stringify(player_data))
    }

    function V() {
        var a = {
            arr: k,
            data: player_data
        };
        last_array = JSON.parse(JSON.stringify(k));
        localStorage.setItem("pplayy_onet_array", JSON.stringify(a))
    }
    var P = this;
    this.add.sprite(0, 0, "background").setOrigin(0);
    var v = "play",
        m = 0,
        n = this,
        B, K = !1,
        t = this.add.group();
    this.add.group();
    var I = this.add.group(),
        l = 0,
        y = {
            width: 80,
            height: 77
        },
        G = (config.width - 8 * y.width) / 2 + y.width / 2,
        H = (config.height - 10 * y.height) / 2 + y.height / 2,
        k = Array(10),
        r = [],
        p = 1,
        u = 18 + player_data.drop_mode;
    22 < u && (u = 22);
    console.log("Max: " + u);
    for (var A = 0; 40 > A; A++) p > u && (p = 1), r.push(p), p++;
    r = r.concat(r);
    q(r);
    p = 0;
    if (last_array)
        for (k = last_array, r = 0; 10 > r; r++)
            for (p = 0; 8 > p; p++) k[r][p].filled && (u = k[r][p].color, A = this.add.sprite(G + y.width * p, H + y.height * r, "obj" + u).setInteractive(), A.color = u, A.piece = !0, A.pos = {
                x: p,
                y: r
            }, t.add(A));
    else
        for (u = 0; 10 > u; u++) {
            A = [];
            for (var L = 0; 8 > L; L++) {
                var Q = r[p],
                    da = {
                        color: Q,
                        filled: !0
                    },
                    M = this.add.sprite(G + y.width * L, H + y.height * u, "obj" + Q).setInteractive();
                M.color = Q;
                M.piece = !0;
                M.pos = {
                    x: L,
                    y: u
                };
                t.add(M);
                p++;
                A.push(da)
            }
            k[u] = A
        }
    this.add.sprite(0, config.height, "header").setOrigin(0, 1);
    this.add.sprite(config.height /
        2, 35, "score_bar");
    var S = this.add.text(config.height / 2, 35, String(player_data.score), {
        fontFamily: "robotomono",
        fontSize: 40,
        align: "center",
        color: "#FFFFFF"
    }).setOrigin(.5);
    this.add.sprite(0, config.height, "footer").setOrigin(0, 1);
    p = draw_button(650, 1020, "hint", this);
    0 === player_data.hint_left && (p.alpha = .5);
    r = draw_button(530, 1020, "shuffle", this);
    0 === player_data.shuffle_left && (r.alpha = .5);
    draw_button(70, 1020, "home", this);
    u = draw_button(190, 1020, "sound_on", this);
    u.name = "sound";
    check_audio(u);
    p = this.add.sprite(p.x + 35,
        p.y + 25, "circle");
    u = this.add.sprite(r.x + 35, r.y + 25, "circle");
    var ca = this.add.text(p.x, p.y, String(player_data.hint_left), {
            fontFamily: "robotomono",
            fontSize: 30,
            align: "center",
            color: "#FFFFFF"
        }).setOrigin(.5),
        ba = this.add.text(u.x, u.y, String(player_data.shuffle_left), {
            fontFamily: "robotomono",
            fontSize: 30,
            align: "center",
            color: "#FFFFFF"
        }).setOrigin(.5),
        z = this.add.sprite(180, 180, "sign");
    z.setDepth(100);
    z.setVisible(!1);
    var C = this.add.sprite(r.x, 960, "arrow");
    C.setDepth(100);
    C.setVisible(!1);
    this.tweens.add({
        targets: z,
        scaleX: 1.1,
        scaleY: 1.1,
        ease: "Linear",
        duration: 250,
        yoyo: !0,
        repeat: -1
    });
    this.tweens.add({
        targets: C,
        y: C.y + 20,
        ease: "Linear",
        duration: 250,
        yoyo: !0,
        repeat: -1
    });
    for (r = 0; 25 > r; r++) p = this.add.sprite(80, 80, "lines"), p.setDepth(100), p.setVisible(!1), I.add(p);
    this.input.keyboard.on("keydown", function(a, b) {
        K = a.key;
        " " === K && "play" === v && D()
    });
    this.input.keyboard.on("keyup", function(a, b) {
        K = !1
    });
    this.input.on("gameobjectdown", function(a, b) {
        if ("z" === K) k[b.pos.y][b.pos.x].filled = !1, b.destroy(!0, !0);
        else if (b.button) play_sound("click",
            P), P.tweens.add({
            targets: b,
            scaleX: .9,
            scaleY: .9,
            yoyo: !0,
            ease: "Linear",
            duration: 100,
            onComplete: function() {
                "play" === v && ("hint" === b.name ? 0 < player_data.hint_left && (player_data.hint_left--, Y(), Z(), 0 === player_data.hint_left && (b.alpha = .5)) : "shuffle" === b.name ? 0 < player_data.shuffle_left && (C.visible && C.setVisible(!1), player_data.shuffle_left--, Y(), w(), 0 === player_data.shuffle_left && (b.alpha = .5)) : "home" === b.name && n.scene.start("menu"));
                "sound" === b.name ? switch_audio(b) : "next" === b.name ? (n.scene.start("game")) :
                    "restart" === b.name ? (player_data.drop_mode = 0, player_data.score = 0, n.scene.start("game")) : "menu" === b.name && (n.scene.start("menu"))
            }
        }, P);
        else if (b.piece) {
            if (B) {
                a = t.getLength();
                for (var c = t.getChildren(), d = 0; d < a; d++) {
                    var e = c[d];
                    (e.pos.x === B[0].x && e.pos.y === B[0].y || e.pos.x === B[1].x && e.pos.y === B[1].y) && e.clearTint()
                }
                B = null
            }
            l ? "play" === v && (play_sound("itemclick", n), b.pos.x != l.pos.x || b.pos.y != l.pos.y) && (b.setTint(5233606), k[b.pos.y][b.pos.x].color === k[l.pos.y][l.pos.x].color ? (a = N(l.pos, b.pos)) ?
                (player_data.score += 2, S.setText(player_data.score), v = "wait1", z.setVisible(!1), T(a), k[b.pos.y][b.pos.x].filled = !1, k[l.pos.y][l.pos.x].filled = !1, setTimeout(function() {
                    v = "wait";
                    g(b.x, b.y, b.color);
                    g(l.x, l.y, l.color);
                    b.destroy(!0, !0);
                    l.destroy(!0, !0);
                    l = null;
                    setTimeout(function() {
                        U()
                    }, 100);
                    O()
                }, 300)) : (l.clearTint(), l = b, z.setPosition(b.x, b.y)) : (l.clearTint(), l = b, z.setPosition(b.x, b.y))) : "play" === v && (play_sound("itemclick", n), l = b, b.setTint(5233606), z.setVisible(!0), z.setPosition(b.x, b.y))
        }
    }, this);
    E() || last_array ||
        this.scene.start("game")
};

function play_sound(g, q) {
    game_data.sound && q.sound.play(g)
}

function switch_audio(g) {
    game_data[g.name] ? (game_data[g.name] = !1, g.setTexture("btn_sound_off")) : (game_data[g.name] = !0, g.setTexture("btn_sound_on"))
}

function check_audio(g) {
    game_data[g.name] ? g.setTexture("btn_sound_on") : g.setTexture("btn_sound_off")
}

function draw_button(g, q, w, D) {
    g = D.add.sprite(g, q, "btn_" + w).setInteractive();
    g.button = !0;
    g.name = w;
    return g
}
var config = {
        type: Phaser.AUTO,
        width: 720,
        height: 1080,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: "game_content",
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [Boot, Load, Menu, Game]
    },
    game = new Phaser.Game(config);