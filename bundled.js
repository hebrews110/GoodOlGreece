(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/// <reference path="node_modules/@types/jquery/index.d.ts" />
/// <reference path="node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="node_modules/@types/bootstrap/index.d.ts" />
/// <reference path="node_modules/@types/browserify/index.d.ts" />
/// <reference path="node_modules/@types/modernizr/index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
String.prototype.string_val = function () {
    return this;
};
var GameTools;
(function (GameTools) {
    (function ($) {
        $.fn.randomize = function (childElem) {
            function shuffle(o) {
                for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
                    ;
                return o;
            }
            ;
            return this.each(function () {
                var $this = $(this);
                var elems = $this.children(childElem);
                shuffle(elems);
                elems.each(function () {
                    $(this).detach();
                });
                for (var i = 0; i < elems.length; i++) {
                    $this.append(elems[i]);
                }
            });
        };
    })(jQuery);
    GameTools.currentLevel = 0;
    GameTools.contentsIndex = 0;
    GameTools.lastResult = false;
    GameTools.lastData = null;
    GameTools.gameContents = [];
    GameTools.defaultNextItem = function (current) {
        if (GameTools.contentsIndex == GameTools.gameContents.length - 1) {
            console.error("No next items");
            return null;
        }
        console.log("Get from index " + (GameTools.contentsIndex + 1));
        return GameTools.gameContents[++GameTools.contentsIndex];
    };
    GameTools.currentlyDisplayed = function () {
        return GameTools.gameContents[GameTools.contentsIndex];
    };
    var DisplayedItem = /** @class */ (function () {
        function DisplayedItem() {
            this._isDisplaying = false;
            this._isDisplaying = false;
            this.reset();
        }
        DisplayedItem.prototype.isDisplaying = function () {
            return this._isDisplaying;
        };
        DisplayedItem.prototype.myIndex = function () {
            return GameTools.gameContents.indexOf(this);
        };
        DisplayedItem.prototype.display = function () {
            this._isDisplaying = true;
        };
        DisplayedItem.prototype.undisplay = function () {
            this._isDisplaying = false;
        };
        DisplayedItem.prototype.getNextItem = function () {
            if (GameTools.defaultNextItem != null)
                return GameTools.defaultNextItem(this);
            else
                throw new Error("No default next item provided");
        };
        DisplayedItem.prototype.redisplay = function () {
            var index = this.myIndex();
            if (index == -1)
                throw "redisplay() requires an in-array element";
            this.undisplay();
            var loop = constructLoop({ index: index, relative: false });
            setTimeout(function () {
                loop.display();
            }, 0);
        };
        DisplayedItem.prototype.displayNext = function () {
            this.undisplay();
            var item = this.getNextItem();
            setTimeout(function () {
                if (item !== null)
                    item.display();
            }, 0);
        };
        DisplayedItem.prototype.reset = function () {
        };
        return DisplayedItem;
    }());
    GameTools.DisplayedItem = DisplayedItem;
    /**
    * Shuffles array in place.
    * @param {Array} a items An array containing the items.
    */
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    GameTools.shuffle = shuffle;
    var InfoBox = /** @class */ (function (_super_1) {
        __extends(InfoBox, _super_1);
        function InfoBox(title, text, buttonText, delay) {
            if (buttonText === void 0) { buttonText = "OK"; }
            if (delay === void 0) { delay = InfoBox.defaultDelay; }
            var _this = _super_1.call(this) || this;
            _this.title = title;
            _this.text = text;
            _this.buttonText = buttonText;
            _this.delay = delay;
            _this.modalDisplayed = false;
            _this.wantsToRedisplay = false;
            return _this;
        }
        InfoBox.prototype.dialogCreated = function () {
        };
        InfoBox.prototype.buttonCallback = function (e) {
            this.displayNext();
        };
        InfoBox.prototype.redisplay = function () {
            this.wantsToRedisplay = true;
            if (this.modalDisplayed) {
                $("#question-dialog").modal('hide');
            }
            else {
                _super_1.prototype.redisplay.call(this);
            }
        };
        InfoBox.prototype.displayNext = function () {
            this.wantsToRedisplay = false;
            if (this.modalDisplayed) {
                $("#question-dialog").modal('hide');
            }
            else {
                _super_1.prototype.displayNext.call(this);
            }
        };
        InfoBox.prototype.display = function () {
            var _this = this;
            setTimeout(function () {
                $('#question-dialog').removeData();
                if (_this.title != null)
                    $("#question-dialog .modal-title").html(_this.title.string_val());
                else
                    $("#question-dialog .modal-title").html("");
                if (_this.text != null) {
                    $("#question-dialog .modal-body").show();
                    $("#question-dialog .modal-body").html(_this.text.string_val());
                }
                else {
                    $("#question-dialog .modal-body").html("");
                    $("#question-dialog .modal-body").hide();
                }
                /* Generate the button */
                $("#question-dialog .modal-footer").empty();
                $("#question-dialog .modal-footer").append($("<button></button>").addClass("btn btn-primary").attr("type", "button"));
                if (_this.buttonText != null && _this.buttonText.string_val() != "") {
                    $("#question-dialog .close").show();
                    $("#question-dialog .modal-footer").show();
                    $("#question-dialog .modal-footer button").text(_this.buttonText.string_val());
                }
                else {
                    $("#question-dialog .close").hide();
                    $("#question-dialog .modal-footer").hide();
                }
                _this.dialogCreated();
                $("#question-dialog .modal-footer button").off("click");
                $("#question-dialog .modal-footer button").on("click", function (e) {
                    _this.buttonCallback(e);
                });
                $("#question-dialog").modal({ backdrop: "static" });
                _this.modalDisplayed = true;
                $("#question-dialog").one("shown.bs.modal", function () {
                });
                $("#question-dialog").one("hidden.bs.modal", function () {
                    _this.modalDisplayed = false;
                    $("#question-dialog").modal('dispose');
                    if (_this.wantsToRedisplay)
                        _this.redisplay();
                    else
                        _this.displayNext();
                });
            }, this.delay);
        };
        InfoBox.defaultDelay = 1000;
        return InfoBox;
    }(DisplayedItem));
    GameTools.InfoBox = InfoBox;
    var Delay = /** @class */ (function (_super_1) {
        __extends(Delay, _super_1);
        function Delay(time) {
            var _this = _super_1.call(this) || this;
            _this.time = time;
            return _this;
        }
        Delay.prototype.display = function () {
            var _this = this;
            setTimeout(function () {
                _this.displayNext();
            }, this.time);
        };
        return Delay;
    }(DisplayedItem));
    GameTools.Delay = Delay;
    var LevelChoice = /** @class */ (function (_super_1) {
        __extends(LevelChoice, _super_1);
        function LevelChoice(levelMarkups) {
            var _this = _super_1.call(this, "Choose a level", "", null) || this;
            _this.levelMarkups = levelMarkups;
            return _this;
        }
        LevelChoice.prototype.dialogCreated = function () {
            $("#question-dialog .modal-body").text("");
            var $container = $("<div></div>");
            $container.addClass("level-buttons");
            this.levelMarkups.forEach(function (element, index) {
                var $button = $("<button></button>");
                $button.html(element.string_val());
                $button.data("level-id", index);
                $button.click(function () {
                    GameTools.currentLevel = $button.data("level-id");
                    $("#question-dialog").modal('hide');
                });
                $container.append($button);
            });
            $("#question-dialog .modal-body").append($container);
        };
        return LevelChoice;
    }(InfoBox));
    GameTools.LevelChoice = LevelChoice;
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    GameTools.getRandomInt = getRandomInt;
    function getRandomArbitrary(min, max) {
        var val = Math.random() * (max - min) + min;
        return val;
    }
    GameTools.getRandomArbitrary = getRandomArbitrary;
    function playAudioIfSupported(audioFile, cb) {
        if (!cb)
            cb = function () { };
        if (Modernizr.audio) {
            var audio = new Audio(audioFile.string_val());
            audio.onerror = function () {
                cb();
            };
            audio.addEventListener("ended", cb);
            audio.play();
        }
        else
            cb();
    }
    GameTools.playAudioIfSupported = playAudioIfSupported;
    var Label = /** @class */ (function (_super_1) {
        __extends(Label, _super_1);
        function Label(name) {
            var _this = _super_1.call(this) || this;
            _this.name = name;
            return _this;
        }
        Label.prototype.display = function () {
            this.displayNext();
        };
        return Label;
    }(GameTools.DisplayedItem));
    GameTools.Label = Label;
    var Loop = /** @class */ (function (_super_1) {
        __extends(Loop, _super_1);
        function Loop(loopInfo, times) {
            if (times === void 0) { times = -1; }
            var _this = _super_1.call(this) || this;
            _this.loopInfo = loopInfo;
            _this.times = times;
            _this.numLoops = 0;
            if (typeof _this.loopInfo.index == "number" && _this.loopInfo.index < 0)
                _this.loopInfo.relative = true;
            else if (_this.loopInfo.relative === undefined)
                _this.loopInfo.relative = true;
            return _this;
        }
        /* Restore a previous loop */
        Loop.prototype.addLoop = function () {
            this.numLoops--;
            if (this.numLoops < -1)
                this.numLoops = -1;
        };
        Loop.prototype.getNumTimesLooped = function () {
            return this.numLoops;
        };
        Loop.prototype.display = function () {
            var _this = this;
            if (this.times < 0 || this.numLoops < this.times) {
                if (typeof this.loopInfo.index == "number") {
                    if (this.loopInfo.relative && this.myIndex() == -1)
                        throw "Not in gameContents array, cannot use relative branch";
                    if (!this.loopInfo.relative)
                        GameTools.contentsIndex = this.loopInfo.index;
                    else
                        GameTools.contentsIndex += this.loopInfo.index;
                }
                else {
                    var labels = GameTools.gameContents.filter(function (e) { return e instanceof Label; });
                    var theLabel_1 = null;
                    labels.some(function (e) {
                        var label = e;
                        if (label.name == _this.loopInfo.index) {
                            theLabel_1 = label;
                            return true;
                        }
                        return false;
                    });
                    if (theLabel_1 == null)
                        throw "Undefined label: " + this.loopInfo.index;
                    GameTools.contentsIndex = theLabel_1.myIndex();
                }
                GameTools.contentsIndex -= 1;
                this.numLoops++;
            }
            if (this.times < 0)
                this.numLoops = 0;
            this.displayNext();
        };
        Loop.prototype.reset = function () {
            this.numLoops = 0;
        };
        return Loop;
    }(GameTools.DisplayedItem));
    GameTools.Loop = Loop;
    function constructLoop(loopInfo, times) {
        if (times === void 0) { times = -1; }
        return new Loop(loopInfo, times);
    }
    var SystemReset = /** @class */ (function (_super_1) {
        __extends(SystemReset, _super_1);
        function SystemReset() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        SystemReset.prototype.display = function () {
            GameTools.resetSystem();
            this.displayNext();
        };
        return SystemReset;
    }(GameTools.DisplayedItem));
    GameTools.SystemReset = SystemReset;
    function resetSystem() {
        GameTools.gameContents.forEach(function (displayedItem) {
            displayedItem.reset();
        });
    }
    GameTools.resetSystem = resetSystem;
    function restart() {
        if (GameTools.gameContents[GameTools.contentsIndex].isDisplaying()) {
            GameTools.gameContents[GameTools.contentsIndex].undisplay();
        }
        GameTools.contentsIndex = 0;
        GameTools.gameContents[GameTools.contentsIndex].display();
    }
    GameTools.restart = restart;
    function cancelTooltipTimeout($target) {
        var timeout = $target.data("tooltip-timeout");
        if (timeout) {
            clearTimeout(timeout);
            $target.removeData("tooltip-timeout");
        }
    }
    function HSLToHex(h, s, l) {
        s /= 100;
        l /= 100;
        var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        }
        else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        }
        else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        }
        else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        }
        else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        }
        else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);
        // Prepend 0s, if necessary
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        return "#" + r + g + b;
    }
    GameTools.HSLToHex = HSLToHex;
    function getContrastYIQ(hexcolor) {
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0, 2), 16);
        var g = parseInt(hexcolor.substr(2, 2), 16);
        var b = parseInt(hexcolor.substr(4, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }
    GameTools.getContrastYIQ = getContrastYIQ;
    var DragTargetsQuestion = /** @class */ (function (_super_1) {
        __extends(DragTargetsQuestion, _super_1);
        function DragTargetsQuestion(title, items, shuffleTargets, shuffleOptions) {
            if (shuffleTargets === void 0) { shuffleTargets = false; }
            if (shuffleOptions === void 0) { shuffleOptions = false; }
            var _this = _super_1.call(this, title, "", "Check") || this;
            _this.title = title;
            _this.items = items;
            _this.shuffleTargets = shuffleTargets;
            _this.shuffleOptions = shuffleOptions;
            return _this;
        }
        DragTargetsQuestion.prototype.buttonCallback = function (e) {
            var $itemsDiv = $("#question-dialog .modal-body .items-div");
            var $targetsDiv = $("#question-dialog .modal-body .targets-div");
            if (!DragTargetsQuestion.alwaysBeRight && $itemsDiv.children().length > 0) {
                GameTools.lastResult = false;
            }
            else {
                var $dragItems = $targetsDiv.find(".drag-item");
                GameTools.lastResult = true;
                if (!DragTargetsQuestion.alwaysBeRight)
                    $dragItems.each(function (index, element) {
                        if (!$(element).data("target").is($(element).parent())) {
                            GameTools.lastResult = false;
                            return false;
                        }
                    });
            }
            _super_1.prototype.buttonCallback.call(this, e);
        };
        DragTargetsQuestion.prototype.dialogCreated = function () {
            var $targetsDiv = $("<div></div>");
            var $itemsDiv = $("<div></div>");
            var $bothDivs = $targetsDiv.add($itemsDiv);
            var $containerDiv = $("<div></div>").append($bothDivs);
            $containerDiv.css({
                "display": "flex",
                "width": "100%",
                "height": "100%"
            });
            $("#question-dialog .modal-body").append($containerDiv);
            $bothDivs.addClass("dragtargets-div");
            $targetsDiv.addClass("targets-div");
            $itemsDiv.addClass("items-div");
            this.items.forEach(function (item) {
                var target = item.target;
                var $span = $("<span></span>").html(target.string_val());
                var $div = $("<div></div>").append($span).addClass("target");
                $div.data("my-text", target);
                $targetsDiv.append($div);
                $div.append($("<i></i>").addClass("fas fa-question-circle").click(function () {
                    var $target = $(this).parent();
                    cancelTooltipTimeout($target);
                    $target.tooltip('show');
                    $target.data("tooltip-timeout", setTimeout(function () {
                        $target.tooltip('hide');
                    }, 3000));
                }));
                $div.children("i").hide();
                var $targetDiv = $div;
                var backColor = HSLToHex(getRandomInt(0, 360), 100, 90);
                $div = $("<div></div>").addClass("drag-item").data("target", $targetDiv).css({
                    "background-color": backColor,
                    "color": getContrastYIQ(backColor)
                });
                $div.append($("<div></div>").css("margin", "auto").html(item.name.string_val()));
                $itemsDiv.append($div);
                $targetDiv.attr("title", $targetDiv.data("my-text"));
                $targetDiv.tooltip({
                    html: true
                });
                $targetDiv.tooltip('disable');
            });
            if (this.shuffleTargets)
                $targetsDiv.randomize();
            if (this.shuffleOptions)
                $itemsDiv.randomize();
            var gtBeforeDropFunction = function (event, ui) {
                console.log("gt before drop");
                if ($(this).hasClass("target")) {
                    $(this).tooltip('enable');
                    $(this).children("i").show();
                    $(this).children("span").hide();
                }
            };
            var dropFunction = function (event, ui) {
                $(this).trigger("gt.before_drop");
                var $draggable = $(document).find(".ui-draggable-dragging");
                if (!$draggable.get(0)) {
                    $draggable = $(this).children(".drag-item");
                    if (!$draggable.get(0)) {
                        throw "Can't find draggable";
                    }
                }
                console.log($draggable[0]);
                $draggable.css({
                    "top": "",
                    "left": ""
                });
                var $newParent = $(this);
                if ($(this).hasClass("target") && $(this).find(".drag-item").length != 0) {
                    $newParent = $itemsDiv;
                }
                $draggable.detach().appendTo($newParent);
                console.log(this);
                if ($newParent.is($itemsDiv))
                    $draggable.css({ "position": "relative" });
            };
            var outFunction = function (event, ui) {
                console.log("out");
                if ($(this).hasClass("target") && $(this).children(".drag-item").hasClass("ui-draggable-dragging")) {
                    console.log($(this).children().get(0));
                    $(this).children("i").hide();
                    $(this).children("span").show();
                    $(this).tooltip('disable');
                }
            };
            var dragInfo = {
                containment: $("body"),
                start: function (event, ui) {
                    $(ui.helper).css({ "transform": "none" });
                },
                revert: function (droppable) {
                    if (!droppable) {
                        console.log("Reverting!");
                        $(this).parent().trigger("gt.before_drop");
                        return true;
                    }
                    else
                        return false;
                },
                drag: function (event, ui) {
                    if ($(ui.helper).parent().hasClass("target")) {
                        $(ui.helper).parent().tooltip("hide");
                        cancelTooltipTimeout($(ui.helper).parent());
                    }
                },
                stop: function (event, ui) {
                    $(ui.helper).css({ "transform": "" });
                },
                scroll: true
            };
            console.log("should scroll");
            $targetsDiv.children("div").droppable().on("drop", dropFunction).on("dropout", outFunction).on("gt.before_drop", gtBeforeDropFunction);
            $itemsDiv.droppable().on("drop", dropFunction).on("dropout", outFunction);
            $itemsDiv.children("div").draggable(dragInfo);
        };
        DragTargetsQuestion.alwaysBeRight = false;
        return DragTargetsQuestion;
    }(InfoBox));
    GameTools.DragTargetsQuestion = DragTargetsQuestion;
    var FunctionDisplayedItem = /** @class */ (function (_super_1) {
        __extends(FunctionDisplayedItem, _super_1);
        function FunctionDisplayedItem(func) {
            var _this = _super_1.call(this) || this;
            _this.func = func;
            return _this;
        }
        FunctionDisplayedItem.prototype.display = function () {
            this.func();
            this.displayNext();
        };
        return FunctionDisplayedItem;
    }(DisplayedItem));
    GameTools.FunctionDisplayedItem = FunctionDisplayedItem;
    var Condition = /** @class */ (function (_super_1) {
        __extends(Condition, _super_1);
        function Condition(trueStatement, falseStatement, customCondition) {
            var _this = _super_1.call(this) || this;
            _this.trueStatement = trueStatement;
            _this.falseStatement = falseStatement;
            _this.customCondition = customCondition;
            if (_this.customCondition === undefined)
                _this.customCondition = function () {
                    return GameTools.lastResult;
                };
            return _this;
        }
        Condition.prototype.display = function () {
            if (this.customCondition())
                this.trueStatement.display();
            else
                this.falseStatement.display();
        };
        Condition.prototype.reset = function () {
            if (this.trueStatement)
                this.trueStatement.reset();
            if (this.falseStatement)
                this.falseStatement.reset();
        };
        return Condition;
    }(DisplayedItem));
    GameTools.Condition = Condition;
    var InteractiveSVG = /** @class */ (function (_super_1) {
        __extends(InteractiveSVG, _super_1);
        function InteractiveSVG(title, imgSrc, interactiveComponents) {
            var _this = _super_1.call(this, title, "", null) || this;
            _this.imgSrc = imgSrc;
            _this.interactiveComponents = interactiveComponents;
            return _this;
        }
        InteractiveSVG.scrollHandler = function () {
            var scrollLeft = ($(".interactive-svg img").width() - $(".interactive-svg").width()) / 2;
            $(".interactive-svg").scrollLeft(scrollLeft);
        };
        InteractiveSVG.prototype.interactiveComponentClicked = function ($component) {
            GameTools.lastData = $component;
            this.displayNext();
        };
        InteractiveSVG.prototype.dialogCreated = function () {
            var _this = this;
            var $svgContainer = $("<div></div>");
            var $img = $("<img></img>");
            $svgContainer.addClass("interactive-svg");
            $svgContainer.load(this.imgSrc.string_val(), function () {
                if (_this.interactiveComponents)
                    _this.interactiveComponents.forEach(function (selector, index) {
                        var svg = $svgContainer.find("svg").get(0);
                        var elements = svg.querySelectorAll(selector.string_val());
                        elements.forEach(function (element) {
                            $(element).addClass("interactive-component");
                            $(element).click(function (e) {
                                _this.interactiveComponentClicked($(e.target));
                            });
                        });
                    });
            });
            $("#question-dialog .modal-body").append($svgContainer);
            $(window).off("resize", InteractiveSVG.scrollHandler);
            $(window).on("resize", InteractiveSVG.scrollHandler);
        };
        InteractiveSVG.prototype.undisplay = function () {
            _super_1.prototype.undisplay.call(this);
            $(window).off("resize", InteractiveSVG.scrollHandler);
        };
        return InteractiveSVG;
    }(InfoBox));
    GameTools.InteractiveSVG = InteractiveSVG;
    var Finder = /** @class */ (function () {
        function Finder(parent, numItems, keyword) {
            if (keyword === void 0) { keyword = Finder.defaultKeyword; }
            this.parent = parent;
            this.numItems = numItems;
            this.keyword = keyword;
            this.itemIndexes = [];
            this.reset();
        }
        Finder.prototype.reset = function () {
            this.itemIndexes = [];
            this.itemsFound = 0;
        };
        Finder.prototype.setTitle = function () {
            if (this.itemsFound > 0)
                $("#question-dialog .modal-title").text("You have " + this.keyword + " " + this.itemsFound + " of " + this.numItems + " items.");
        };
        Finder.prototype.itemFound = function ($component) {
            if (this.itemIndexes.indexOf($component.data("index")) == -1) {
                this.itemsFound++;
                this.itemIndexes.push($component.data("index"));
            }
            this.$componentFound = $component;
            this.parent.displayNext();
        };
        Finder.prototype.finished = function () {
            return this.itemsFound == this.numItems;
        };
        Finder.defaultKeyword = "found";
        return Finder;
    }());
    GameTools.Finder = Finder;
    var InteractiveSVGFinder = /** @class */ (function (_super_1) {
        __extends(InteractiveSVGFinder, _super_1);
        function InteractiveSVGFinder(title, imgSrc, interactiveComponents, numItems) {
            var _this = _super_1.call(this, title, imgSrc, interactiveComponents) || this;
            _this.imgSrc = imgSrc;
            _this.numItems = numItems;
            _this.itemsFound = 0;
            _this.finder = new Finder(_this, numItems);
            return _this;
        }
        InteractiveSVGFinder.prototype.interactiveComponentClicked = function ($component) {
            this.finder.itemFound($component);
        };
        InteractiveSVGFinder.prototype.reset = function () {
            if (this.finder != null)
                this.finder.reset();
            _super_1.prototype.reset.call(this);
        };
        return InteractiveSVGFinder;
    }(InteractiveSVG));
    GameTools.InteractiveSVGFinder = InteractiveSVGFinder;
    var ButtonFinder = /** @class */ (function (_super_1) {
        __extends(ButtonFinder, _super_1);
        function ButtonFinder(title, instructions, buttons, delay) {
            if (delay === void 0) { delay = InfoBox.defaultDelay; }
            var _this = _super_1.call(this, title, instructions, null, delay) || this;
            _this.instructions = instructions;
            _this.buttons = buttons;
            _this.delay = delay;
            _this.didDisplay = false;
            _this.finder = new Finder(_this, buttons.length, "explored");
            _this.foundIndexes = [];
            return _this;
        }
        ButtonFinder.prototype.reset = function () {
            if (this.finder != null)
                this.finder.reset();
            _super_1.prototype.reset.call(this);
            this.foundIndexes = [];
            this.didDisplay = false;
        };
        ButtonFinder.prototype.displayNext = function () {
            if (this.didDisplay)
                GameTools.lastResult = false;
            else
                GameTools.lastResult = this.finder.finished();
            console.log(this.finder.$componentFound.get(0));
            GameTools.lastData = this.finder.$componentFound.data("index");
            _super_1.prototype.displayNext.call(this);
        };
        ButtonFinder.prototype.display = function () {
            if (this.finder.finished()) {
                this.didDisplay = false;
                this.displayNext();
            }
            else {
                this.didDisplay = true;
                _super_1.prototype.display.call(this);
            }
        };
        ButtonFinder.prototype.dialogCreated = function () {
            var _this = this;
            var $body = $("#question-dialog .modal-body");
            $body.html("");
            $body.show();
            if (this.instructions != null)
                $body.append($("<span></span>").html(this.instructions.string_val()));
            this.finder.setTitle();
            var $finderButtons = $("<div></div>").addClass("finder-buttons").appendTo($body);
            this.buttons.forEach(function (element, index) {
                var $button = $("<button></button>").html(element.string_val());
                if (_this.foundIndexes.indexOf(index) != -1) {
                    $button.addClass("was_found");
                }
                $button.data("index", index);
                $button.data("element", element);
                $button.click(function (e) {
                    $finderButtons.children("button").prop("disabled", true);
                    _this.foundIndexes.push($(e.target).data("index"));
                    _this.finder.itemFound($(e.target));
                });
                $finderButtons.append($button);
            });
        };
        return ButtonFinder;
    }(InfoBox));
    GameTools.ButtonFinder = ButtonFinder;
    function imageAndText(imgSrc, text) {
        return "<img src='" + imgSrc + "'></img>" + text;
    }
    GameTools.imageAndText = imageAndText;
    var TrueFalseQuestion = /** @class */ (function (_super_1) {
        __extends(TrueFalseQuestion, _super_1);
        function TrueFalseQuestion(question, correctAnswer) {
            var _this = _super_1.call(this, question, null, "True") || this;
            _this.correctAnswer = correctAnswer;
            return _this;
        }
        TrueFalseQuestion.prototype.buttonCallback = function (e) {
            var isTrue = $(e.target).text() == "True";
            if (this.correctAnswer !== undefined) {
                GameTools.lastResult = isTrue == this.correctAnswer;
            }
            else
                GameTools.lastResult = isTrue;
            _super_1.prototype.buttonCallback.call(this, e);
        };
        TrueFalseQuestion.prototype.dialogCreated = function () {
            var $footer = $("#question-dialog .modal-footer");
            $footer.append($("<button></button>").addClass("btn btn-secondary").text("False").click(this.buttonCallback));
        };
        return TrueFalseQuestion;
    }(InfoBox));
    GameTools.TrueFalseQuestion = TrueFalseQuestion;
    var MultipleChoiceQuestion = /** @class */ (function (_super_1) {
        __extends(MultipleChoiceQuestion, _super_1);
        function MultipleChoiceQuestion(question, choices, shouldReDisplay) {
            if (shouldReDisplay === void 0) { shouldReDisplay = false; }
            var _this = _super_1.call(this, "Choose one of the choices.", question, null) || this;
            _this.choices = choices;
            _this.shouldReDisplay = shouldReDisplay;
            return _this;
        }
        MultipleChoiceQuestion.prototype.answered = function ($button) {
            var option = $button.data("questionOption");
            if (option.correct) {
                GameTools.lastResult = true;
                this.displayNext();
            }
            else {
                GameTools.lastResult = false;
                this.title = "Sorry, that wasn't the correct answer.";
                if (this.shouldReDisplay)
                    this.redisplay();
                else
                    this.displayNext();
            }
        };
        MultipleChoiceQuestion.prototype.dialogCreated = function () {
            var _this = this;
            var $body = $("#question-dialog .modal-body");
            var $finderButtons = $("<div></div>").addClass("finder-buttons").appendTo($body);
            shuffle(this.choices).forEach(function (element, index) {
                var $button = $("<button></button>").html(element.html.string_val());
                var backColor = HSLToHex(getRandomInt(0, 360), 100, 90);
                $button.css({
                    "background-color": backColor,
                    "color": getContrastYIQ(backColor)
                });
                $button.data("index", index);
                $button.data("questionOption", element);
                $button.click(function (e) {
                    $finderButtons.children("button").prop("disabled", true);
                    _this.answered($button);
                });
                $finderButtons.append($button);
            });
        };
        return MultipleChoiceQuestion;
    }(InfoBox));
    GameTools.MultipleChoiceQuestion = MultipleChoiceQuestion;
    function monkeyPatch() {
        $.widget("ui.draggable", $.ui.draggable, {
            _mouseStart: function (event) {
                this._super(event);
                this.origScroll = this.options.scroll;
                if (this.cssPosition === "fixed" || this.hasFixedAncestor) {
                    this.options.scroll = false;
                }
            },
            _mouseStop: function (event) {
                this._super(event);
                this.options.scroll = this.origScroll;
            }
        });
    }
    GameTools.monkeyPatch = monkeyPatch;
})(GameTools || (GameTools = {}));
var GreeceInteractiveMap = /** @class */ (function (_super_1) {
    __extends(GreeceInteractiveMap, _super_1);
    function GreeceInteractiveMap() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    GreeceInteractiveMap.prototype.interactiveComponentClicked = function ($component) {
        if ($component.attr("id") != "Europe") {
            $("#question-dialog .modal-title").text("Nope, that's " + $component.attr("id").replace('_', ' '));
        }
        else {
            $("#question-dialog").modal('hide');
        }
    };
    return GreeceInteractiveMap;
}(GameTools.InteractiveSVG));
var athens = [
    "Only men were allowed to vote in Athens. Voting took place by use of a hand-count. Ballots weren't commonly used back then!",
    "The Acropolis is a hill in Athens that temples for the gods and goddesses were built on.",
    "The Parthenon is a temple that was originally built to honor the goddess Athena. Though it was built thousands of years ago, it is still standing today.",
    "Girls did not attend school in Athens; instead, they were taught by their mothers how to cook, clean, and do other maternal duties.",
    "Boys in Athens spent 2 years training to be soldiers when they reached 18. They had the letter A painted on their shield. Athenian boys had to buy their own weapons.",
    "Athenian boys went to school at the age of 7. They learned reading, writing, music, and poetry. At 18 they left to join the military.",
    "In Athens, people lived in houses built below the Acropolis.",
    "The olive tree was believed to have been given to Athens as a gift by the goddess Athena."
];
var sparta = [
    "In Sparta, olive trees were used as a way to thank the gods for a victory. After an intense battle the Spartans would hang their weapons in the tree.",
    "When boys were 20 years old they joined the Spartan army. They always wore red cloaks when they went to fight, and were known for being the toughest warriors in Greece!",
    "Even though girls weren't in the army, they had to stay active so they could have healthy babies, because Spartan babies always had to be strong",
    "Spartans only wanted the best, so weak Spartan babies were left to die.",
    "Boys in Sparta didn't go to school. As soon as they turned 7 they started training for the military. Pretty different from Athens, huh?",
    "Spartan boys were deliberately kept hungry, so they had to roam around stealing food to survive. This taught them useful skills for battle."
];
GameTools.gameContents = [
    new GameTools.InfoBox("Welcome!", "Welcome to Good Ol' Greece.<p></p>If you're playing on a small device, we recommend using landscape for some or all of the parts in this game."),
    new GameTools.Label("dragquestion"),
    new GameTools.DragTargetsQuestion("Place the dates on top of their matching event.", [
        { name: "1852 B.C.", target: "Pyramids begin to be built" },
        { name: "500 B.C.", target: "Greek Classical Age" },
        { name: "0 B.C./A.D.", target: "Christ is born" },
        { name: "410 A.D.", target: "The fall of Rome" },
        { name: "1066 A.D.", target: "The Battle of Hastings" },
        { name: "1952 A.D.", target: "Queen Elizabeth II crowned" }
    ], false, true),
    new GameTools.Condition(new GameTools.Loop({ index: "dq_correct" }), new GameTools.Loop({ index: "dq_incorrect" })),
    new GameTools.Label("dq_correct"),
    new GameTools.InfoBox("Great job!", "You must know what you're doing!", "Continue"),
    new GameTools.Loop({ index: "first-map" }),
    new GameTools.Label("dq_incorrect"),
    new GameTools.InfoBox("Whoops!", "Looks like something went wrong there. Give it another try!", "Try again"),
    new GameTools.Loop({ index: "dragquestion" }),
    new GameTools.Label("first-map"),
    new GreeceInteractiveMap("Select the continent Greece is in.", "Continents.svg", [
        ".interactive-continent"
    ]),
    new GameTools.InfoBox("Nice work!", "Greece is located in southern Europe.", "OK"),
    new GameTools.Label("second-map"),
    new GameTools.ButtonFinder("Athens: Explore the items!", null, [
        GameTools.imageAndText("raising_hand.png", "Democracy"),
        GameTools.imageAndText("acropolis.jpg", "Acropolis"),
        GameTools.imageAndText("parthenon.jpg", "Parthenon"),
        GameTools.imageAndText("girl.gif", "Greek girls"),
        GameTools.imageAndText("hoplite.jpg", "Hoplites"),
        GameTools.imageAndText("youngboy.gif", "Young boy"),
        GameTools.imageAndText("house.gif", "House"),
        GameTools.imageAndText("tree.png", "Olive tree")
    ], 0),
    new GameTools.Condition(new GameTools.Loop({ index: "third-map" }), new GameTools.Label("fallthrough")),
    new GameTools.InfoBox("Information", { string_val: function () {
            return athens[GameTools.lastData];
        } }, "OK", 0),
    new GameTools.Loop({ index: "second-map" }),
    new GameTools.Label("third-map"),
    new GameTools.ButtonFinder("Sparta: Explore the items!", null, [
        GameTools.imageAndText("tree.png", "Tree"),
        GameTools.imageAndText("hoplite.jpg", "Soldier"),
        GameTools.imageAndText("girl.gif", "Spartan girls"),
        GameTools.imageAndText("babies.jpg", "Spartan babies"),
        GameTools.imageAndText("youngboy.gif", "Spartan boys"),
        GameTools.imageAndText("stealing.jpg", "Stealing")
    ], 0),
    new GameTools.Condition(new GameTools.Loop({ index: "fourth-map" }), new GameTools.Label("fallthrough")),
    new GameTools.InfoBox("Information", { string_val: function () {
            return sparta[GameTools.lastData];
        } }, "OK", 0),
    new GameTools.Loop({ index: "third-map" }),
    new GameTools.Label("fourth-map"),
    new GameTools.DragTargetsQuestion("Mount Olympus: Match the symbols to the gods and goddesses.", [
        { name: "<img src='lightning.svg'></img>", target: "<b>Zeus</b><br/>I need my lightning bolt" },
        { name: "<img src='harp.svg'></img>", target: "<b>Apollo</b><br/>I can't play music without a harp" },
        { name: "<img src='pomegranate.jpg'></img>", target: "<b>Hera</b><br/>I need my pomegranate" },
        { name: "<img src='winged_boot.jpg'></img>", target: "<b>Hermes</b><br/>I need my winged boots" },
        { name: "<img src='rose.png'></img>", target: "<b>Aphrodite</b><br/>I love my rose" },
        { name: "<img src='bow_and_arrow.png'></img>", target: "<b>Artemis</b><br/>I need my bow" },
        { name: "<img src='wheat.svg'></img>", target: "<b>Demeter</b><br/>I need my wheat" },
        { name: "<img src='trident.svg'></img>", target: "<b>Poseidon</b><br/>I can't find my trident" },
        { name: "<img src='wine.svg'></img>", target: "<b>Dionysus</b><br/>I need my wine" },
        { name: "<img src='hammer.svg'></img>", target: "<b>Hephaestus</b><br/>I need my hammer" },
        { name: "<img src='spear.svg'></img>", target: "<b>Ares</b><br/>Give me my spear" },
        { name: "<img src='tree.png'></img>", target: "<b>Athena</b><br/>I can't find my olive tree" },
    ], true, true),
    new GameTools.Condition(new GameTools.Loop({ index: "quiz" }), new GameTools.Label("fallthrough")),
    new GameTools.InfoBox("Nope!", "It seems that you didn't match the symbols properly.", "Try again"),
    new GameTools.Loop({ index: "fourth-map" }),
    new GameTools.Label("quiz"),
    new GameTools.InfoBox("Great job!", "The gods are pleased.", "OK"),
    new GameTools.InfoBox("Welcome to the Quiz", "Now you'll be tested on your knowledge of Athens, Sparta, and Mount Olympus."),
    new GameTools.MultipleChoiceQuestion("At what age did boys from Sparta start going to school?", [
        { html: "7", correct: true },
        { html: "16" },
        { html: "They didn't!" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Who were the temples on the Acropolis built for?", [
        { html: "The gods", correct: true },
        { html: "Rich people" },
        { html: "Soldiers" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Which god or goddess gave an olive tree to Athens?", [
        { html: "Athena", correct: true },
        { html: "Artemis" },
        { html: "Aphrodite" }
    ], true),
    new GameTools.MultipleChoiceQuestion("At what age did girls from Sparta start going to school?", [
        { html: "7" },
        { html: "16" },
        { html: "They didn't!", correct: true }
    ], true),
    new GameTools.MultipleChoiceQuestion("Which god was worshipped in the Parthenon?", [
        { html: "Athena", correct: true },
        { html: "Zeus" },
        { html: "Aristotle" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Spartan girls kept fit so they could have...?", [
        { html: "Healthy babies", correct: true },
        { html: "Fun" },
        { html: "A laugh" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Spartan boys were kept hungry, so they had to...", [
        { html: "Steal food!", correct: true },
        { html: "Fight a lot!" },
        { html: "Borrow money!" }
    ], true),
    new GameTools.MultipleChoiceQuestion("What was Sparta surrounded by to protect it?", [
        { html: "Mountains", correct: true },
        { html: "An army of Spartans" },
        { html: "Machine guns" }
    ], true),
    new GameTools.MultipleChoiceQuestion("What type of Spartan baby was left to die?", [
        { html: "Weak babies", correct: true },
        { html: "Fat babies" },
        { html: "Inconsolable babies" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Which god was responsible for protecting Athens?", [
        { html: "Athena", correct: true },
        { html: "Poseidon" },
        { html: "Plato" }
    ], true),
    new GameTools.Label("hack1"),
    new GameTools.MultipleChoiceQuestion("The twelve gods and goddesses lived on...", [
        { html: "Mount Olympus", correct: true },
        { html: "My roof" },
        { html: "An island in Greece" }
    ], true),
    new GameTools.InfoBox("Thanks for playing!", "If you want to play again, you can refresh the page.", null),
];
$(window).on("load", function () {
    $(".se-pre-con").fadeOut("slow");
    GameTools.monkeyPatch();
    GameTools.resetSystem();
    GameTools.restart();
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSw4REFBOEQ7QUFDOUQsZ0VBQWdFO0FBQ2hFLGlFQUFpRTtBQUNqRSxrRUFBa0U7QUFDbEUsaUVBQWlFOzs7Ozs7Ozs7Ozs7OztBQU9qRSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRztJQUMxQixPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUE7QUFDRCxJQUFVLFNBQVMsQ0FneEJsQjtBQWh4QkQsV0FBVSxTQUFTO0lBQ2YsQ0FBQyxVQUFTLENBQUM7UUFDTixDQUFDLENBQUMsRUFBVSxDQUFDLFNBQVMsR0FBRyxVQUFTLFNBQVM7WUFDeEMsU0FBUyxPQUFPLENBQUMsQ0FBQztnQkFDZCxLQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLENBQUM7Z0JBQ3JHLE9BQU8sQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFBLENBQUM7WUFDRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUV0QyxPQUFP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RyxDQUFDLENBQUM7U0FDckI7YUFBTSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUM3QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7YUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUM5QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7YUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUM5QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7YUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUM5QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7YUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUM5QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7UUFDRCwrQ0FBK0M7UUFDL0MsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FB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LEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUNuQixFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRTtLQUNsQyxFQUFFLElBQUksQ0FBQztJQUNSLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxzREFBc0QsRUFBRSxJQUFJLENBQUM7Q0FDN0csQ0FBQztBQUNGLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO0lBQ2pCLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3hCLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QixTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9qcXVlcnkvaW5kZXguZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9qcXVlcnl1aS9pbmRleC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJub2RlX21vZHVsZXMvQHR5cGVzL2Jvb3RzdHJhcC9pbmRleC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJub2RlX21vZHVsZXMvQHR5cGVzL2Jyb3dzZXJpZnkvaW5kZXguZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9tb2Rlcm5penIvaW5kZXguZC50c1wiIC8+XG5cblxuZGVjbGFyZSBpbnRlcmZhY2UgU3RyaW5nIHtcbiAgICBzdHJpbmdfdmFsKCk6IHN0cmluZztcbn1cblxuU3RyaW5nLnByb3RvdHlwZS5zdHJpbmdfdmFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5uYW1lc3BhY2UgR2FtZVRvb2xzIHtcbiAgICAoZnVuY3Rpb24oJCkge1xuICAgICAgICAoJC5mbiBhcyBhbnkpLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKGNoaWxkRWxlbSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gc2h1ZmZsZShvKSB7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBqLCB4LCBpID0gby5sZW5ndGg7IGk7IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKSwgeCA9IG9bLS1pXSwgb1tpXSA9IG9bal0sIG9bal0gPSB4KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1zID0gJHRoaXMuY2hpbGRyZW4oY2hpbGRFbGVtKTtcbiAgICBcbiAgICAgICAgICAgICAgICBzaHVmZmxlKGVsZW1zKTtcbiAgICBcbiAgICAgICAgICAgICAgICBlbGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgZWxlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYXBwZW5kKGVsZW1zW2ldKTsgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTsgICAgXG4gICAgICAgIH1cbiAgICB9KShqUXVlcnkpO1xuICAgIGV4cG9ydCBsZXQgY3VycmVudExldmVsID0gMDtcbiAgICBleHBvcnQgbGV0IGNvbnRlbnRzSW5kZXggPSAwO1xuICAgIGV4cG9ydCBsZXQgbGFzdFJlc3VsdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGV4cG9ydCBsZXQgbGFzdERhdGE6IGFueSA9IG51bGw7XG4gICAgZXhwb3J0IGxldCBnYW1lQ29udGVudHM6IEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtW10gPSBbXTtcbiAgICBleHBvcnQgbGV0IGRlZmF1bHROZXh0SXRlbSA9IGZ1bmN0aW9uKGN1cnJlbnQ6IEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtKTogR2FtZVRvb2xzLkRpc3BsYXllZEl0ZW0ge1xuICAgICAgICBpZihjb250ZW50c0luZGV4ID09IGdhbWVDb250ZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gbmV4dCBpdGVtc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR2V0IGZyb20gaW5kZXggXCIgKyAoY29udGVudHNJbmRleCArIDEpKTtcbiAgICAgICAgcmV0dXJuIGdhbWVDb250ZW50c1srK2NvbnRlbnRzSW5kZXhdO1xuICAgIH07XG4gICAgZXhwb3J0IGxldCBjdXJyZW50bHlEaXNwbGF5ZWQgPSBmdW5jdGlvbigpOiBHYW1lVG9vbHMuRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIHJldHVybiBnYW1lQ29udGVudHNbY29udGVudHNJbmRleF07XG4gICAgfTtcblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgcHJpdmF0ZSBfaXNEaXNwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBpc0Rpc3BsYXlpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNEaXNwbGF5aW5nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5faXNEaXNwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgbXlJbmRleCgpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIGdhbWVDb250ZW50cy5pbmRleE9mKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLl9pc0Rpc3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHVuZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuX2lzRGlzcGxheWluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGdldE5leHRJdGVtKCk6IERpc3BsYXllZEl0ZW0ge1xuICAgICAgICAgICAgaWYgKGRlZmF1bHROZXh0SXRlbSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0TmV4dEl0ZW0odGhpcyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gZGVmYXVsdCBuZXh0IGl0ZW0gcHJvdmlkZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIHJlZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMubXlJbmRleCgpO1xuICAgICAgICAgICAgaWYoaW5kZXggPT0gLTEpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJyZWRpc3BsYXkoKSByZXF1aXJlcyBhbiBpbi1hcnJheSBlbGVtZW50XCI7XG4gICAgICAgICAgICB0aGlzLnVuZGlzcGxheSgpO1xuICAgICAgICAgICAgdmFyIGxvb3AgPSBjb25zdHJ1Y3RMb29wKHsgaW5kZXg6IGluZGV4LCByZWxhdGl2ZTogZmFsc2V9KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvb3AuZGlzcGxheSgpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGRpc3BsYXlOZXh0KCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy51bmRpc3BsYXkoKTtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5nZXROZXh0SXRlbSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoaXRlbSAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldCgpOiB2b2lkIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBTaHVmZmxlcyBhcnJheSBpbiBwbGFjZS5cbiAgICAqIEBwYXJhbSB7QXJyYXl9IGEgaXRlbXMgQW4gYXJyYXkgY29udGFpbmluZyB0aGUgaXRlbXMuXG4gICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gc2h1ZmZsZTxUPihhOiBUW10pOiBUW10ge1xuICAgICAgICBsZXQgajogbnVtYmVyLCB4OiBULCBpOiBudW1iZXI7XG4gICAgICAgIGZvciAoaSA9IGEubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgeCA9IGFbaV07XG4gICAgICAgICAgICBhW2ldID0gYVtqXTtcbiAgICAgICAgICAgIGFbal0gPSB4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBpbnRlcmZhY2UgR2FtZVN0cmluZyB7XG4gICAgICAgIHN0cmluZ192YWwoKTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgSW5mb0JveCBleHRlbmRzIERpc3BsYXllZEl0ZW0ge1xuICAgICAgICBwcml2YXRlIG1vZGFsRGlzcGxheWVkID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgZGVmYXVsdERlbGF5ID0gMTAwMDtcbiAgICAgICAgcHJpdmF0ZSB3YW50c1RvUmVkaXNwbGF5ID0gZmFsc2U7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCB0aXRsZTogR2FtZVN0cmluZywgcHJvdGVjdGVkIHRleHQ6IEdhbWVTdHJpbmcsIHByb3RlY3RlZCBidXR0b25UZXh0OiBHYW1lU3RyaW5nID0gXCJPS1wiLCBwcm90ZWN0ZWQgZGVsYXkgPSBJbmZvQm94LmRlZmF1bHREZWxheSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZGlhbG9nQ3JlYXRlZCgpOiB2b2lkIHtcblxuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBidXR0b25DYWxsYmFjayhlOiBKUXVlcnkuQ2xpY2tFdmVudCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMud2FudHNUb1JlZGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgICBpZih0aGlzLm1vZGFsRGlzcGxheWVkKSB7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VwZXIucmVkaXNwbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheU5leHQoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLndhbnRzVG9SZWRpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmKHRoaXMubW9kYWxEaXNwbGF5ZWQpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZ1wiKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdXBlci5kaXNwbGF5TmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKCcjcXVlc3Rpb24tZGlhbG9nJykucmVtb3ZlRGF0YSgpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudGl0bGUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLmh0bWwodGhpcy50aXRsZS5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50ZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHlcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS5odG1sKHRoaXMudGV4dC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBHZW5lcmF0ZSB0aGUgYnV0dG9uICovXG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWZvb3RlclwiKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXJcIikuYXBwZW5kKCQoXCI8YnV0dG9uPjwvYnV0dG9uPlwiKS5hZGRDbGFzcyhcImJ0biBidG4tcHJpbWFyeVwiKS5hdHRyKFwidHlwZVwiLCBcImJ1dHRvblwiKSk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5idXR0b25UZXh0ICE9IG51bGwgJiYgdGhpcy5idXR0b25UZXh0LnN0cmluZ192YWwoKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5jbG9zZVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXJcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyIGJ1dHRvblwiKS50ZXh0KHRoaXMuYnV0dG9uVGV4dC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5jbG9zZVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXJcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ0NyZWF0ZWQoKTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyIGJ1dHRvblwiKS5vZmYoXCJjbGlja1wiKTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyIGJ1dHRvblwiKS5vbihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uQ2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoIHsgYmFja2Ryb3A6IFwic3RhdGljXCIgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbERpc3BsYXllZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikub25lKFwic2hvd24uYnMubW9kYWxcIiwgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZ1wiKS5vbmUoXCJoaWRkZW4uYnMubW9kYWxcIiwgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RhbERpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2Rpc3Bvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMud2FudHNUb1JlZGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgfSwgdGhpcy5kZWxheSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRGVsYXkgZXh0ZW5kcyBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHRpbWU6IG51bWJlcikge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgICAgICAgICAgfSwgdGhpcy50aW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgTGV2ZWxDaG9pY2UgZXh0ZW5kcyBJbmZvQm94IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGxldmVsTWFya3VwczogKEdhbWVTdHJpbmcpW10pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ2hvb3NlIGEgbGV2ZWxcIiwgXCJcIiwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS50ZXh0KFwiXCIpO1xuICAgICAgICAgICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwibGV2ZWwtYnV0dG9uc1wiKTtcbiAgICAgICAgICAgIHRoaXMubGV2ZWxNYXJrdXBzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0ICRidXR0b24gPSAkKFwiPGJ1dHRvbj48L2J1dHRvbj5cIik7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5odG1sKGVsZW1lbnQuc3RyaW5nX3ZhbCgpKTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmRhdGEoXCJsZXZlbC1pZFwiLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEdhbWVUb29scy5jdXJyZW50TGV2ZWwgPSAkYnV0dG9uLmRhdGEoXCJsZXZlbC1pZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmFwcGVuZCgkYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHlcIikuYXBwZW5kKCRjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JbnQobWluIDogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xuICAgICAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGxldCB2YWwgPSBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBwbGF5QXVkaW9JZlN1cHBvcnRlZChhdWRpb0ZpbGU6IEdhbWVTdHJpbmcsIGNiPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZighY2IpXG4gICAgICAgICAgICBjYiA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIGlmKE1vZGVybml6ci5hdWRpbykge1xuICAgICAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKGF1ZGlvRmlsZS5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgYXVkaW8ub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwiZW5kZWRcIiwgY2IpO1xuICAgICAgICAgICAgYXVkaW8ucGxheSgpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGNiKCk7XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBMYWJlbCBleHRlbmRzIEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IEdhbWVTdHJpbmcpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIExvb3BJbmZvIHtcbiAgICAgICAgaW5kZXg6IG51bWJlciB8IHN0cmluZztcbiAgICAgICAgcmVsYXRpdmU/OiBib29sZWFuO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgTG9vcCBleHRlbmRzIEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgbnVtTG9vcHMgPSAwO1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbG9vcEluZm86IExvb3BJbmZvLCBwdWJsaWMgdGltZXMgPSAtMSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmxvb3BJbmZvLmluZGV4ID09IFwibnVtYmVyXCIgJiYgdGhpcy5sb29wSW5mby5pbmRleCA8IDApXG4gICAgICAgICAgICAgICAgdGhpcy5sb29wSW5mby5yZWxhdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMubG9vcEluZm8ucmVsYXRpdmUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aGlzLmxvb3BJbmZvLnJlbGF0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvKiBSZXN0b3JlIGEgcHJldmlvdXMgbG9vcCAqL1xuICAgICAgICBhZGRMb29wKCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5udW1Mb29wcy0tO1xuICAgICAgICAgICAgaWYodGhpcy5udW1Mb29wcyA8IC0xKVxuICAgICAgICAgICAgICAgIHRoaXMubnVtTG9vcHMgPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBnZXROdW1UaW1lc0xvb3BlZCgpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtTG9vcHM7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmKHRoaXMudGltZXMgPCAwIHx8IHRoaXMubnVtTG9vcHMgPCB0aGlzLnRpbWVzKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMubG9vcEluZm8uaW5kZXggPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmxvb3BJbmZvLnJlbGF0aXZlICYmIHRoaXMubXlJbmRleCgpID09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJOb3QgaW4gZ2FtZUNvbnRlbnRzIGFycmF5LCBjYW5ub3QgdXNlIHJlbGF0aXZlIGJyYW5jaFwiO1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5sb29wSW5mby5yZWxhdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggPSB0aGlzLmxvb3BJbmZvLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50c0luZGV4ICs9IHRoaXMubG9vcEluZm8uaW5kZXg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhYmVscyA9IEdhbWVUb29scy5nYW1lQ29udGVudHMuZmlsdGVyKGUgPT4gZSBpbnN0YW5jZW9mIExhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUxhYmVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzLnNvbWUoZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSAoZSBhcyBMYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihsYWJlbC5uYW1lID09IHRoaXMubG9vcEluZm8uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVMYWJlbCA9IGxhYmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhlTGFiZWwgPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVW5kZWZpbmVkIGxhYmVsOiBcIiArIHRoaXMubG9vcEluZm8uaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggPSB0aGVMYWJlbC5teUluZGV4KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggLT0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLm51bUxvb3BzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRpbWVzIDwgMClcbiAgICAgICAgICAgICAgICB0aGlzLm51bUxvb3BzID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMubnVtTG9vcHMgPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbnN0cnVjdExvb3AobG9vcEluZm86IExvb3BJbmZvLCB0aW1lcyA9IC0xKSB7XG4gICAgICAgIHJldHVybiBuZXcgTG9vcChsb29wSW5mbywgdGltZXMpO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgU3lzdGVtUmVzZXQgZXh0ZW5kcyBHYW1lVG9vbHMuRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICBHYW1lVG9vbHMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gcmVzZXRTeXN0ZW0oKTogdm9pZCB7XG4gICAgICAgIGdhbWVDb250ZW50cy5mb3JFYWNoKGRpc3BsYXllZEl0ZW0gPT4ge1xuICAgICAgICAgICAgZGlzcGxheWVkSXRlbS5yZXNldCgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIGlmKGdhbWVDb250ZW50c1tjb250ZW50c0luZGV4XS5pc0Rpc3BsYXlpbmcoKSkge1xuICAgICAgICAgICAgZ2FtZUNvbnRlbnRzW2NvbnRlbnRzSW5kZXhdLnVuZGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRlbnRzSW5kZXggPSAwO1xuICAgICAgICBnYW1lQ29udGVudHNbY29udGVudHNJbmRleF0uZGlzcGxheSgpO1xuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIERyYWdUYXJnZXRzUXVlc3Rpb25JdGVtIHtcbiAgICAgICAgdGFyZ2V0OiBHYW1lU3RyaW5nO1xuICAgICAgICBuYW1lOiBHYW1lU3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbmNlbFRvb2x0aXBUaW1lb3V0KCR0YXJnZXQ6IEpRdWVyeSk6IHZvaWQge1xuICAgICAgICB2YXIgdGltZW91dCA9ICR0YXJnZXQuZGF0YShcInRvb2x0aXAtdGltZW91dFwiKTtcbiAgICAgICAgaWYodGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgJHRhcmdldC5yZW1vdmVEYXRhKFwidG9vbHRpcC10aW1lb3V0XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBIU0xUb0hleChoLHMsbCkge1xuICAgICAgICBzIC89IDEwMDtcbiAgICAgICAgbCAvPSAxMDA7XG4gICAgICBcbiAgICAgICAgbGV0IGMgPSAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpICogcyxcbiAgICAgICAgICAgIHggPSBjICogKDEgLSBNYXRoLmFicygoaCAvIDYwKSAlIDIgLSAxKSksXG4gICAgICAgICAgICBtID0gbCAtIGMvMixcbiAgICAgICAgICAgIHI6IHN0cmluZyB8IG51bWJlciA9IDAsXG4gICAgICAgICAgICBnOiBzdHJpbmcgfCBudW1iZXIgPSAwLFxuICAgICAgICAgICAgYjogc3RyaW5nIHwgbnVtYmVyID0gMDtcbiAgICAgIFxuICAgICAgICBpZiAoMCA8PSBoICYmIGggPCA2MCkge1xuICAgICAgICAgIHIgPSBjOyBnID0geDsgYiA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoNjAgPD0gaCAmJiBoIDwgMTIwKSB7XG4gICAgICAgICAgciA9IHg7IGcgPSBjOyBiID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICgxMjAgPD0gaCAmJiBoIDwgMTgwKSB7XG4gICAgICAgICAgciA9IDA7IGcgPSBjOyBiID0geDtcbiAgICAgICAgfSBlbHNlIGlmICgxODAgPD0gaCAmJiBoIDwgMjQwKSB7XG4gICAgICAgICAgciA9IDA7IGcgPSB4OyBiID0gYztcbiAgICAgICAgfSBlbHNlIGlmICgyNDAgPD0gaCAmJiBoIDwgMzAwKSB7XG4gICAgICAgICAgciA9IHg7IGcgPSAwOyBiID0gYztcbiAgICAgICAgfSBlbHNlIGlmICgzMDAgPD0gaCAmJiBoIDwgMzYwKSB7XG4gICAgICAgICAgciA9IGM7IGcgPSAwOyBiID0geDtcbiAgICAgICAgfVxuICAgICAgICAvLyBIYXZpbmcgb2J0YWluZWQgUkdCLCBjb252ZXJ0IGNoYW5uZWxzIHRvIGhleFxuICAgICAgICByID0gTWF0aC5yb3VuZCgociArIG0pICogMjU1KS50b1N0cmluZygxNik7XG4gICAgICAgIGcgPSBNYXRoLnJvdW5kKChnICsgbSkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgYiA9IE1hdGgucm91bmQoKGIgKyBtKSAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgICAgXG4gICAgICAgIC8vIFByZXBlbmQgMHMsIGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAoci5sZW5ndGggPT0gMSlcbiAgICAgICAgICByID0gXCIwXCIgKyByO1xuICAgICAgICBpZiAoZy5sZW5ndGggPT0gMSlcbiAgICAgICAgICBnID0gXCIwXCIgKyBnO1xuICAgICAgICBpZiAoYi5sZW5ndGggPT0gMSlcbiAgICAgICAgICBiID0gXCIwXCIgKyBiO1xuICAgICAgXG4gICAgICAgIHJldHVybiBcIiNcIiArIHIgKyBnICsgYjtcbiAgICB9XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyYXN0WUlRKGhleGNvbG9yKXtcbiAgICAgICAgaGV4Y29sb3IgPSBoZXhjb2xvci5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcbiAgICAgICAgdmFyIHIgPSBwYXJzZUludChoZXhjb2xvci5zdWJzdHIoMCwyKSwxNik7XG4gICAgICAgIHZhciBnID0gcGFyc2VJbnQoaGV4Y29sb3Iuc3Vic3RyKDIsMiksMTYpO1xuICAgICAgICB2YXIgYiA9IHBhcnNlSW50KGhleGNvbG9yLnN1YnN0cig0LDIpLDE2KTtcbiAgICAgICAgdmFyIHlpcSA9ICgocioyOTkpKyhnKjU4NykrKGIqMTE0KSkvMTAwMDtcbiAgICAgICAgcmV0dXJuICh5aXEgPj0gMTI4KSA/ICdibGFjaycgOiAnd2hpdGUnO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRHJhZ1RhcmdldHNRdWVzdGlvbiBleHRlbmRzIEluZm9Cb3gge1xuICAgICAgICBzdGF0aWMgYWx3YXlzQmVSaWdodCA9IGZhbHNlO1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdGl0bGU6IEdhbWVTdHJpbmcsIHByb3RlY3RlZCBpdGVtczogRHJhZ1RhcmdldHNRdWVzdGlvbkl0ZW1bXSwgcHJvdGVjdGVkIHNodWZmbGVUYXJnZXRzID0gZmFsc2UsIHByb3RlY3RlZCBzaHVmZmxlT3B0aW9ucyA9IGZhbHNlKSB7XG4gICAgICAgICAgICBzdXBlcih0aXRsZSwgXCJcIiwgXCJDaGVja1wiKTtcbiAgICAgICAgfVxuICAgICAgICBidXR0b25DYWxsYmFjayhlOiBKUXVlcnkuQ2xpY2tFdmVudCk6IHZvaWQge1xuICAgICAgICAgICAgdmFyICRpdGVtc0RpdiA9ICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5IC5pdGVtcy1kaXZcIik7XG4gICAgICAgICAgICB2YXIgJHRhcmdldHNEaXYgPSAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHkgLnRhcmdldHMtZGl2XCIpO1xuICAgICAgICAgICAgaWYoIURyYWdUYXJnZXRzUXVlc3Rpb24uYWx3YXlzQmVSaWdodCAmJiAkaXRlbXNEaXYuY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3RSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyICRkcmFnSXRlbXMgPSAkdGFyZ2V0c0Rpdi5maW5kKFwiLmRyYWctaXRlbVwiKTtcbiAgICAgICAgICAgICAgICBHYW1lVG9vbHMubGFzdFJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYoIURyYWdUYXJnZXRzUXVlc3Rpb24uYWx3YXlzQmVSaWdodClcbiAgICAgICAgICAgICAgICAgICAgJGRyYWdJdGVtcy5lYWNoKChpbmRleCwgZWxlbWVudCk6IGZhbHNlIHwgdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighKCQoZWxlbWVudCkuZGF0YShcInRhcmdldFwiKSBhcyBKUXVlcnk8SFRNTEVsZW1lbnQ+KS5pcygkKGVsZW1lbnQpLnBhcmVudCgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1cGVyLmJ1dHRvbkNhbGxiYWNrKGUpO1xuICAgICAgICB9XG4gICAgICAgIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICB2YXIgJHRhcmdldHNEaXYgPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAgICAgICB2YXIgJGl0ZW1zRGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgICAgICAgdmFyICRib3RoRGl2cyA9ICAkdGFyZ2V0c0Rpdi5hZGQoJGl0ZW1zRGl2KTtcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyRGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpLmFwcGVuZCgkYm90aERpdnMpO1xuICAgICAgICAgICAgJGNvbnRhaW5lckRpdi5jc3Moe1xuICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiBcImZsZXhcIixcbiAgICAgICAgICAgICAgICBcIndpZHRoXCI6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiMTAwJVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLmFwcGVuZCgkY29udGFpbmVyRGl2KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGJvdGhEaXZzLmFkZENsYXNzKFwiZHJhZ3RhcmdldHMtZGl2XCIpO1xuICAgICAgICAgICAgJHRhcmdldHNEaXYuYWRkQ2xhc3MoXCJ0YXJnZXRzLWRpdlwiKTtcbiAgICAgICAgICAgICRpdGVtc0Rpdi5hZGRDbGFzcyhcIml0ZW1zLWRpdlwiKTtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBpdGVtLnRhcmdldDtcbiAgICAgICAgICAgICAgICBsZXQgJHNwYW4gPSAkKFwiPHNwYW4+PC9zcGFuPlwiKS5odG1sKHRhcmdldC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIGxldCAkZGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpLmFwcGVuZCgkc3BhbikuYWRkQ2xhc3MoXCJ0YXJnZXRcIik7XG4gICAgICAgICAgICAgICAgJGRpdi5kYXRhKFwibXktdGV4dFwiLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgICR0YXJnZXRzRGl2LmFwcGVuZCgkZGl2KTtcbiAgICAgICAgICAgICAgICAkZGl2LmFwcGVuZCgkKFwiPGk+PC9pPlwiKS5hZGRDbGFzcyhcImZhcyBmYS1xdWVzdGlvbi1jaXJjbGVcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gJCh0aGlzKS5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsVG9vbHRpcFRpbWVvdXQoJHRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICR0YXJnZXQudG9vbHRpcCgnc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LmRhdGEoXCJ0b29sdGlwLXRpbWVvdXRcIiwgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LnRvb2x0aXAoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMzAwMCkpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAkZGl2LmNoaWxkcmVuKFwiaVwiKS5oaWRlKCk7XG5cblxuICAgICAgICAgICAgICAgIGNvbnN0ICR0YXJnZXREaXYgPSAkZGl2O1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tDb2xvciA9IEhTTFRvSGV4KGdldFJhbmRvbUludCgwLCAzNjApLCAxMDAsIDkwKTtcbiAgICAgICAgICAgICAgICAkZGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpLmFkZENsYXNzKFwiZHJhZy1pdGVtXCIpLmRhdGEoXCJ0YXJnZXRcIiwgJHRhcmdldERpdikuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IGJhY2tDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBnZXRDb250cmFzdFlJUShiYWNrQ29sb3IpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGRpdi5hcHBlbmQoJChcIjxkaXY+PC9kaXY+XCIpLmNzcyhcIm1hcmdpblwiLCBcImF1dG9cIikuaHRtbChpdGVtLm5hbWUuc3RyaW5nX3ZhbCgpKSk7XG4gICAgICAgICAgICAgICAgJGl0ZW1zRGl2LmFwcGVuZCgkZGl2KTtcbiAgICAgICAgICAgICAgICAkdGFyZ2V0RGl2LmF0dHIoXCJ0aXRsZVwiLCAkdGFyZ2V0RGl2LmRhdGEoXCJteS10ZXh0XCIpKTtcbiAgICAgICAgICAgICAgICAkdGFyZ2V0RGl2LnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICBodG1sOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHRhcmdldERpdi50b29sdGlwKCdkaXNhYmxlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKHRoaXMuc2h1ZmZsZVRhcmdldHMpXG4gICAgICAgICAgICAgICAgKCR0YXJnZXRzRGl2IGFzIGFueSkucmFuZG9taXplKCk7XG4gICAgICAgICAgICBpZih0aGlzLnNodWZmbGVPcHRpb25zKVxuICAgICAgICAgICAgICAgICgkaXRlbXNEaXYgYXMgYW55KS5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBndEJlZm9yZURyb3BGdW5jdGlvbiA9IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImd0IGJlZm9yZSBkcm9wXCIpO1xuICAgICAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoXCJ0YXJnZXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b29sdGlwKCdlbmFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbihcImlcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKFwic3BhblwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGRyb3BGdW5jdGlvbiA9IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKFwiZ3QuYmVmb3JlX2Ryb3BcIik7XG4gICAgICAgICAgICAgICAgbGV0ICRkcmFnZ2FibGUgPSAkKGRvY3VtZW50KS5maW5kKFwiLnVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiKTtcbiAgICAgICAgICAgICAgICBpZighJGRyYWdnYWJsZS5nZXQoMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRyYWdnYWJsZSA9ICQodGhpcykuY2hpbGRyZW4oXCIuZHJhZy1pdGVtXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZighJGRyYWdnYWJsZS5nZXQoMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3QgZmluZCBkcmFnZ2FibGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkZHJhZ2dhYmxlWzBdKTtcbiAgICAgICAgICAgICAgICAkZHJhZ2dhYmxlLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIFwidG9wXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGVmdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyICRuZXdQYXJlbnQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoXCJ0YXJnZXRcIikgJiYgJCh0aGlzKS5maW5kKFwiLmRyYWctaXRlbVwiKS5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkbmV3UGFyZW50ID0gJGl0ZW1zRGl2O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZHJhZ2dhYmxlLmRldGFjaCgpLmFwcGVuZFRvKCRuZXdQYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmKCRuZXdQYXJlbnQuaXMoJGl0ZW1zRGl2KSlcbiAgICAgICAgICAgICAgICAgICAgJGRyYWdnYWJsZS5jc3MoeyBcInBvc2l0aW9uXCI6IFwicmVsYXRpdmVcIn0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBvdXRGdW5jdGlvbiA9IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm91dFwiKTtcbiAgICAgICAgICAgICAgICBpZigkKHRoaXMpLmhhc0NsYXNzKFwidGFyZ2V0XCIpICYmICQodGhpcykuY2hpbGRyZW4oXCIuZHJhZy1pdGVtXCIpLmhhc0NsYXNzKFwidWktZHJhZ2dhYmxlLWRyYWdnaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCQodGhpcykuY2hpbGRyZW4oKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKFwiaVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oXCJzcGFuXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b29sdGlwKCdkaXNhYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBkcmFnSW5mbzogSlF1ZXJ5VUkuRHJhZ2dhYmxlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBjb250YWlubWVudDogJChcImJvZHlcIiksXG4gICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh1aS5oZWxwZXIpLmNzcyh7IFwidHJhbnNmb3JtXCI6IFwibm9uZVwifSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmV2ZXJ0OiBmdW5jdGlvbiAoZHJvcHBhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFkcm9wcGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV2ZXJ0aW5nIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkudHJpZ2dlcihcImd0LmJlZm9yZV9kcm9wXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZHJhZzogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICBpZigkKHVpLmhlbHBlcikucGFyZW50KCkuaGFzQ2xhc3MoXCJ0YXJnZXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodWkuaGVscGVyKS5wYXJlbnQoKS50b29sdGlwKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbFRvb2x0aXBUaW1lb3V0KCQodWkuaGVscGVyKS5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh1aS5oZWxwZXIpLmNzcyh7IFwidHJhbnNmb3JtXCI6IFwiXCJ9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjcm9sbDogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hvdWxkIHNjcm9sbFwiKTtcbiAgICAgICAgICAgICR0YXJnZXRzRGl2LmNoaWxkcmVuKFwiZGl2XCIpLmRyb3BwYWJsZSgpLm9uKFwiZHJvcFwiLCBkcm9wRnVuY3Rpb24pLm9uKFwiZHJvcG91dFwiLCBvdXRGdW5jdGlvbikub24oXCJndC5iZWZvcmVfZHJvcFwiLCBndEJlZm9yZURyb3BGdW5jdGlvbik7XG4gICAgICAgICAgICAkaXRlbXNEaXYuZHJvcHBhYmxlKCkub24oXCJkcm9wXCIsIGRyb3BGdW5jdGlvbikub24oXCJkcm9wb3V0XCIsIG91dEZ1bmN0aW9uKTtcbiAgICAgICAgICAgICRpdGVtc0Rpdi5jaGlsZHJlbihcImRpdlwiKS5kcmFnZ2FibGUoZHJhZ0luZm8pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBGdW5jdGlvbkRpc3BsYXllZEl0ZW0gZXh0ZW5kcyBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLmZ1bmMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgQ29uZGl0aW9uIGV4dGVuZHMgRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0cnVlU3RhdGVtZW50OiBEaXNwbGF5ZWRJdGVtLCBwdWJsaWMgZmFsc2VTdGF0ZW1lbnQ6IERpc3BsYXllZEl0ZW0sIHB1YmxpYyBjdXN0b21Db25kaXRpb24/OiAoKSA9PiBib29sZWFuKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgaWYodGhpcy5jdXN0b21Db25kaXRpb24gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbUNvbmRpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2FtZVRvb2xzLmxhc3RSZXN1bHQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodGhpcy5jdXN0b21Db25kaXRpb24oKSlcbiAgICAgICAgICAgICAgICB0aGlzLnRydWVTdGF0ZW1lbnQuZGlzcGxheSgpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuZmFsc2VTdGF0ZW1lbnQuZGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodGhpcy50cnVlU3RhdGVtZW50KVxuICAgICAgICAgICAgICAgIHRoaXMudHJ1ZVN0YXRlbWVudC5yZXNldCgpO1xuICAgICAgICAgICAgaWYodGhpcy5mYWxzZVN0YXRlbWVudClcbiAgICAgICAgICAgICAgICB0aGlzLmZhbHNlU3RhdGVtZW50LnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIEludGVyYWN0aXZlU1ZHIGV4dGVuZHMgSW5mb0JveCB7XG4gICAgICAgIGNvbnN0cnVjdG9yICh0aXRsZTogR2FtZVN0cmluZywgcHVibGljIGltZ1NyYzogR2FtZVN0cmluZywgcHVibGljIGludGVyYWN0aXZlQ29tcG9uZW50cz86IEdhbWVTdHJpbmdbXSkge1xuICAgICAgICAgICAgc3VwZXIodGl0bGUsIFwiXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBzY3JvbGxIYW5kbGVyKCk6IHZvaWQge1xuICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQgPSAoJChcIi5pbnRlcmFjdGl2ZS1zdmcgaW1nXCIpLndpZHRoKCkgLSAkKFwiLmludGVyYWN0aXZlLXN2Z1wiKS53aWR0aCgpKSAvIDI7XG4gICAgICAgICAgICAkKFwiLmludGVyYWN0aXZlLXN2Z1wiKS5zY3JvbGxMZWZ0KHNjcm9sbExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIGludGVyYWN0aXZlQ29tcG9uZW50Q2xpY2tlZCgkY29tcG9uZW50OiBKUXVlcnk8U1ZHRWxlbWVudD4pOiB2b2lkIHtcbiAgICAgICAgICAgIEdhbWVUb29scy5sYXN0RGF0YSA9ICRjb21wb25lbnQ7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlOZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlhbG9nQ3JlYXRlZCgpOiB2b2lkIHtcbiAgICAgICAgICAgIGxldCAkc3ZnQ29udGFpbmVyID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgICAgICAgbGV0ICRpbWcgPSAkKFwiPGltZz48L2ltZz5cIik7XG4gICAgICAgICAgICAkc3ZnQ29udGFpbmVyLmFkZENsYXNzKFwiaW50ZXJhY3RpdmUtc3ZnXCIpO1xuICAgICAgICAgICAgJHN2Z0NvbnRhaW5lci5sb2FkKHRoaXMuaW1nU3JjLnN0cmluZ192YWwoKSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaW50ZXJhY3RpdmVDb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlQ29tcG9uZW50cy5mb3JFYWNoKChzZWxlY3RvciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdmcgPSAkc3ZnQ29udGFpbmVyLmZpbmQoXCJzdmdcIikuZ2V0KDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBzdmcucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvci5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKFwiaW50ZXJhY3RpdmUtY29tcG9uZW50XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZUNvbXBvbmVudENsaWNrZWQoKCQoZS50YXJnZXQpIGFzIEpRdWVyeTxFbGVtZW50PikgYXMgSlF1ZXJ5PFNWR0VsZW1lbnQ+KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS5hcHBlbmQoJHN2Z0NvbnRhaW5lcik7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwicmVzaXplXCIsIEludGVyYWN0aXZlU1ZHLnNjcm9sbEhhbmRsZXIpO1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIEludGVyYWN0aXZlU1ZHLnNjcm9sbEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICAgIHVuZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHN1cGVyLnVuZGlzcGxheSgpO1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInJlc2l6ZVwiLCBJbnRlcmFjdGl2ZVNWRy5zY3JvbGxIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRmluZGVyIHtcbiAgICAgICAgcHVibGljIGl0ZW1zRm91bmQ6IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSBpdGVtSW5kZXhlczogYW55W10gPSBbXTtcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkb25seSBkZWZhdWx0S2V5d29yZCA9IFwiZm91bmRcIjtcbiAgICAgICAgcHVibGljICRjb21wb25lbnRGb3VuZDogSlF1ZXJ5O1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFyZW50OiBEaXNwbGF5ZWRJdGVtLCBwdWJsaWMgbnVtSXRlbXM6IG51bWJlciwgcHVibGljIGtleXdvcmQgPSBGaW5kZXIuZGVmYXVsdEtleXdvcmQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbUluZGV4ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNGb3VuZCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGl0bGUoKTogdm9pZCB7XG4gICAgICAgICAgICBpZih0aGlzLml0ZW1zRm91bmQgPiAwKVxuICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC10aXRsZVwiKS50ZXh0KFwiWW91IGhhdmUgXCIgKyB0aGlzLmtleXdvcmQgKyBcIiBcIiArIHRoaXMuaXRlbXNGb3VuZCArIFwiIG9mIFwiICsgdGhpcy5udW1JdGVtcyArIFwiIGl0ZW1zLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtRm91bmQoJGNvbXBvbmVudDogSlF1ZXJ5PGFueT4pOiB2b2lkIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYodGhpcy5pdGVtSW5kZXhlcy5pbmRleE9mKCRjb21wb25lbnQuZGF0YShcImluZGV4XCIpKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNGb3VuZCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbUluZGV4ZXMucHVzaCgkY29tcG9uZW50LmRhdGEoXCJpbmRleFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRjb21wb25lbnRGb3VuZCA9ICRjb21wb25lbnQ7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5kaXNwbGF5TmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmlzaGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXNGb3VuZCA9PSB0aGlzLm51bUl0ZW1zO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBJbnRlcmFjdGl2ZVNWR0ZpbmRlciBleHRlbmRzIEludGVyYWN0aXZlU1ZHIHtcbiAgICAgICAgZmluZGVyOiBGaW5kZXI7XG4gICAgICAgIGNvbnN0cnVjdG9yKHRpdGxlOiBHYW1lU3RyaW5nLCBwdWJsaWMgaW1nU3JjOiBHYW1lU3RyaW5nLCBpbnRlcmFjdGl2ZUNvbXBvbmVudHM6IChHYW1lU3RyaW5nKVtdLCBwdWJsaWMgbnVtSXRlbXM6IG51bWJlcikge1xuICAgICAgICAgICAgc3VwZXIodGl0bGUsIGltZ1NyYywgaW50ZXJhY3RpdmVDb21wb25lbnRzKTtcbiAgICAgICAgICAgIHRoaXMuZmluZGVyID0gbmV3IEZpbmRlcih0aGlzLCBudW1JdGVtcyk7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGl0ZW1zRm91bmQgPSAwO1xuICAgICAgICBpbnRlcmFjdGl2ZUNvbXBvbmVudENsaWNrZWQoJGNvbXBvbmVudDogSlF1ZXJ5PFNWR0VsZW1lbnQ+KTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLmZpbmRlci5pdGVtRm91bmQoJGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgICAgICBpZih0aGlzLmZpbmRlciAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuZmluZGVyLnJlc2V0KCk7XG4gICAgICAgICAgICBzdXBlci5yZXNldCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b25GaW5kZXIgZXh0ZW5kcyBJbmZvQm94IHtcbiAgICAgICAgZmluZGVyOiBGaW5kZXI7XG4gICAgICAgIGRpZERpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgZm91bmRJbmRleGVzOiBudW1iZXJbXTtcbiAgICAgICAgY29uc3RydWN0b3IodGl0bGU6IEdhbWVTdHJpbmcsIHB1YmxpYyBpbnN0cnVjdGlvbnM6IEdhbWVTdHJpbmcsIHB1YmxpYyBidXR0b25zOiAoR2FtZVN0cmluZylbXSwgcHVibGljIGRlbGF5ID0gSW5mb0JveC5kZWZhdWx0RGVsYXkpIHtcbiAgICAgICAgICAgIHN1cGVyKHRpdGxlLCBpbnN0cnVjdGlvbnMsIG51bGwsIGRlbGF5KTtcbiAgICAgICAgICAgIHRoaXMuZmluZGVyID0gbmV3IEZpbmRlcih0aGlzLCBidXR0b25zLmxlbmd0aCwgXCJleHBsb3JlZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZm91bmRJbmRleGVzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgICAgICBpZih0aGlzLmZpbmRlciAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuZmluZGVyLnJlc2V0KCk7XG4gICAgICAgICAgICBzdXBlci5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5mb3VuZEluZGV4ZXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZGlkRGlzcGxheSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXlOZXh0KCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodGhpcy5kaWREaXNwbGF5KVxuICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3RSZXN1bHQgPSB0aGlzLmZpbmRlci5maW5pc2hlZCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5maW5kZXIuJGNvbXBvbmVudEZvdW5kLmdldCgwKSk7XG4gICAgICAgICAgICBHYW1lVG9vbHMubGFzdERhdGEgPSB0aGlzLmZpbmRlci4kY29tcG9uZW50Rm91bmQuZGF0YShcImluZGV4XCIpO1xuICAgICAgICAgICAgc3VwZXIuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodGhpcy5maW5kZXIuZmluaXNoZWQoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlkRGlzcGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaWREaXNwbGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdXBlci5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGlhbG9nQ3JlYXRlZCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHZhciAkYm9keSA9ICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpO1xuICAgICAgICAgICAgJGJvZHkuaHRtbChcIlwiKTtcbiAgICAgICAgICAgICRib2R5LnNob3coKTtcblxuICAgICAgICAgICAgaWYodGhpcy5pbnN0cnVjdGlvbnMgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAkYm9keS5hcHBlbmQoJChcIjxzcGFuPjwvc3Bhbj5cIikuaHRtbCh0aGlzLmluc3RydWN0aW9ucy5zdHJpbmdfdmFsKCkpKTtcbiAgICAgICAgICAgIHRoaXMuZmluZGVyLnNldFRpdGxlKCk7XG4gICAgICAgICAgICB2YXIgJGZpbmRlckJ1dHRvbnMgPSAkKFwiPGRpdj48L2Rpdj5cIikuYWRkQ2xhc3MoXCJmaW5kZXItYnV0dG9uc1wiKS5hcHBlbmRUbygkYm9keSk7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgJGJ1dHRvbiA9ICQoXCI8YnV0dG9uPjwvYnV0dG9uPlwiKS5odG1sKGVsZW1lbnQuc3RyaW5nX3ZhbCgpKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmZvdW5kSW5kZXhlcy5pbmRleE9mKGluZGV4KSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uLmFkZENsYXNzKFwid2FzX2ZvdW5kXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkYnV0dG9uLmRhdGEoXCJpbmRleFwiLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5kYXRhKFwiZWxlbWVudFwiLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRmaW5kZXJCdXR0b25zLmNoaWxkcmVuKFwiYnV0dG9uXCIpLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3VuZEluZGV4ZXMucHVzaCgkKGUudGFyZ2V0KS5kYXRhKFwiaW5kZXhcIikpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmRlci5pdGVtRm91bmQoJChlLnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRmaW5kZXJCdXR0b25zLmFwcGVuZCgkYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbWFnZUFuZFRleHQoaW1nU3JjOiBHYW1lU3RyaW5nLCB0ZXh0OiBHYW1lU3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiPGltZyBzcmM9J1wiICsgaW1nU3JjICsgXCInPjwvaW1nPlwiICsgdGV4dDtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIFRydWVGYWxzZVF1ZXN0aW9uIGV4dGVuZHMgSW5mb0JveCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBHYW1lU3RyaW5nLCBwcm90ZWN0ZWQgY29ycmVjdEFuc3dlcj86IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHN1cGVyKHF1ZXN0aW9uLCBudWxsLCBcIlRydWVcIik7XG4gICAgICAgIH1cbiAgICAgICAgYnV0dG9uQ2FsbGJhY2soZTogSlF1ZXJ5LkNsaWNrRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgICAgIGNvbnN0IGlzVHJ1ZSA9ICQoZS50YXJnZXQpLnRleHQoKSA9PSBcIlRydWVcIjtcbiAgICAgICAgICAgIGlmKHRoaXMuY29ycmVjdEFuc3dlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3RSZXN1bHQgPSBpc1RydWUgPT0gdGhpcy5jb3JyZWN0QW5zd2VyO1xuICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3RSZXN1bHQgPSBpc1RydWU7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgc3VwZXIuYnV0dG9uQ2FsbGJhY2soZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGlhbG9nQ3JlYXRlZCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHZhciAkZm9vdGVyID0gJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWZvb3RlclwiKTtcbiAgICAgICAgICAgICRmb290ZXIuYXBwZW5kKCQoXCI8YnV0dG9uPjwvYnV0dG9uPlwiKS5hZGRDbGFzcyhcImJ0biBidG4tc2Vjb25kYXJ5XCIpLnRleHQoXCJGYWxzZVwiKS5jbGljayh0aGlzLmJ1dHRvbkNhbGxiYWNrKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXhwb3J0IGludGVyZmFjZSBRdWVzdGlvbk9wdGlvbiB7XG4gICAgICAgIGh0bWw6IEdhbWVTdHJpbmc7XG4gICAgICAgIGNvcnJlY3Q/OiBib29sZWFuO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgTXVsdGlwbGVDaG9pY2VRdWVzdGlvbiBleHRlbmRzIEluZm9Cb3gge1xuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogR2FtZVN0cmluZywgcHJvdGVjdGVkIGNob2ljZXM6IFF1ZXN0aW9uT3B0aW9uW10sIHByb3RlY3RlZCBzaG91bGRSZURpc3BsYXkgPSBmYWxzZSkge1xuICAgICAgICAgICAgc3VwZXIoXCJDaG9vc2Ugb25lIG9mIHRoZSBjaG9pY2VzLlwiLCBxdWVzdGlvbiwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYW5zd2VyZWQoJGJ1dHRvbjogSlF1ZXJ5PEhUTUxFbGVtZW50Pik6IHZvaWQge1xuICAgICAgICAgICAgbGV0IG9wdGlvbjogUXVlc3Rpb25PcHRpb24gPSAkYnV0dG9uLmRhdGEoXCJxdWVzdGlvbk9wdGlvblwiKTtcbiAgICAgICAgICAgIGlmKG9wdGlvbi5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3RSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3RSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gXCJTb3JyeSwgdGhhdCB3YXNuJ3QgdGhlIGNvcnJlY3QgYW5zd2VyLlwiO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvdWxkUmVEaXNwbGF5KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICB2YXIgJGJvZHkgPSAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKTtcbiAgICAgICAgICAgIHZhciAkZmluZGVyQnV0dG9ucyA9ICQoXCI8ZGl2PjwvZGl2PlwiKS5hZGRDbGFzcyhcImZpbmRlci1idXR0b25zXCIpLmFwcGVuZFRvKCRib2R5KTtcbiAgICAgICAgICAgIHNodWZmbGUodGhpcy5jaG9pY2VzKS5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciAkYnV0dG9uID0gJChcIjxidXR0b24+PC9idXR0b24+XCIpLmh0bWwoZWxlbWVudC5odG1sLnN0cmluZ192YWwoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFja0NvbG9yID0gSFNMVG9IZXgoZ2V0UmFuZG9tSW50KDAsIDM2MCksIDEwMCwgOTApO1xuICAgICAgICAgICAgICAgICRidXR0b24uY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IGJhY2tDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBnZXRDb250cmFzdFlJUShiYWNrQ29sb3IpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5kYXRhKFwiaW5kZXhcIiwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICRidXR0b24uZGF0YShcInF1ZXN0aW9uT3B0aW9uXCIsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICRidXR0b24uY2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJGZpbmRlckJ1dHRvbnMuY2hpbGRyZW4oXCJidXR0b25cIikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlcmVkKCRidXR0b24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRmaW5kZXJCdXR0b25zLmFwcGVuZCgkYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBtb25rZXlQYXRjaCgpIHtcbiAgICAgICAgJC53aWRnZXQoXCJ1aS5kcmFnZ2FibGVcIiwgKCQudWkgYXMgYW55KS5kcmFnZ2FibGUsIHtcblxuICAgICAgICAgICAgX21vdXNlU3RhcnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuX3N1cGVyKGV2ZW50KTtcbiAgICAgICAgICAgICAgdGhpcy5vcmlnU2Nyb2xsID0gdGhpcy5vcHRpb25zLnNjcm9sbDtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuY3NzUG9zaXRpb249PT1cImZpeGVkXCIgfHwgdGhpcy5oYXNGaXhlZEFuY2VzdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgICAgIF9tb3VzZVN0b3A6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuX3N1cGVyKGV2ZW50KTtcbiAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbCA9IHRoaXMub3JpZ1Njcm9sbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY2xhc3MgR3JlZWNlSW50ZXJhY3RpdmVNYXAgZXh0ZW5kcyBHYW1lVG9vbHMuSW50ZXJhY3RpdmVTVkcge1xuICAgIGludGVyYWN0aXZlQ29tcG9uZW50Q2xpY2tlZCgkY29tcG9uZW50OiBKUXVlcnk8U1ZHRWxlbWVudD4pOiB2b2lkIHtcbiAgICAgICAgaWYoJGNvbXBvbmVudC5hdHRyKFwiaWRcIikgIT0gXCJFdXJvcGVcIikge1xuICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLnRleHQoXCJOb3BlLCB0aGF0J3MgXCIgKyAkY29tcG9uZW50LmF0dHIoXCJpZFwiKS5yZXBsYWNlKCdfJywgJyAnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZ1wiKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5sZXQgYXRoZW5zOiBzdHJpbmdbXSA9IFtcbiAgICBcIk9ubHkgbWVuIHdlcmUgYWxsb3dlZCB0byB2b3RlIGluIEF0aGVucy4gVm90aW5nIHRvb2sgcGxhY2UgYnkgdXNlIG9mIGEgaGFuZC1jb3VudC4gQmFsbG90cyB3ZXJlbid0IGNvbW1vbmx5IHVzZWQgYmFjayB0aGVuIVwiLFxuICAgIFwiVGhlIEFjcm9wb2xpcyBpcyBhIGhpbGwgaW4gQXRoZW5zIHRoYXQgdGVtcGxlcyBmb3IgdGhlIGdvZHMgYW5kIGdvZGRlc3NlcyB3ZXJlIGJ1aWx0IG9uLlwiLFxuICAgIFwiVGhlIFBhcnRoZW5vbiBpcyBhIHRlbXBsZSB0aGF0IHdhcyBvcmlnaW5hbGx5IGJ1aWx0IHRvIGhvbm9yIHRoZSBnb2RkZXNzIEF0aGVuYS4gVGhvdWdoIGl0IHdhcyBidWlsdCB0aG91c2FuZHMgb2YgeWVhcnMgYWdvLCBpdCBpcyBzdGlsbCBzdGFuZGluZyB0b2RheS5cIixcbiAgICBcIkdpcmxzIGRpZCBub3QgYXR0ZW5kIHNjaG9vbCBpbiBBdGhlbnM7IGluc3RlYWQsIHRoZXkgd2VyZSB0YXVnaHQgYnkgdGhlaXIgbW90aGVycyBob3cgdG8gY29vaywgY2xlYW4sIGFuZCBkbyBvdGhlciBtYXRlcm5hbCBkdXRpZXMuXCIsXG4gICAgXCJCb3lzIGluIEF0aGVucyBzcGVudCAyIHllYXJzIHRyYWluaW5nIHRvIGJlIHNvbGRpZXJzIHdoZW4gdGhleSByZWFjaGVkIDE4LiBUaGV5IGhhZCB0aGUgbGV0dGVyIEEgcGFpbnRlZCBvbiB0aGVpciBzaGllbGQuIEF0aGVuaWFuIGJveXMgaGFkIHRvIGJ1eSB0aGVpciBvd24gd2VhcG9ucy5cIixcbiAgICBcIkF0aGVuaWFuIGJveXMgd2VudCB0byBzY2hvb2wgYXQgdGhlIGFnZSBvZiA3LiBUaGV5IGxlYXJuZWQgcmVhZGluZywgd3JpdGluZywgbXVzaWMsIGFuZCBwb2V0cnkuIEF0IDE4IHRoZXkgbGVmdCB0byBqb2luIHRoZSBtaWxpdGFyeS5cIixcbiAgICBcIkluIEF0aGVucywgcGVvcGxlIGxpdmVkIGluIGhvdXNlcyBidWlsdCBiZWxvdyB0aGUgQWNyb3BvbGlzLlwiLFxuICAgIFwiVGhlIG9saXZlIHRyZWUgd2FzIGJlbGlldmVkIHRvIGhhdmUgYmVlbiBnaXZlbiB0byBBdGhlbnMgYXMgYSBnaWZ0IGJ5IHRoZSBnb2RkZXNzIEF0aGVuYS5cIlxuXTtcbmxldCBzcGFydGE6IHN0cmluZ1tdID0gW1xuICAgIFwiSW4gU3BhcnRhLCBvbGl2ZSB0cmVlcyB3ZXJlIHVzZWQgYXMgYSB3YXkgdG8gdGhhbmsgdGhlIGdvZHMgZm9yIGEgdmljdG9yeS4gQWZ0ZXIgYW4gaW50ZW5zZSBiYXR0bGUgdGhlIFNwYXJ0YW5zIHdvdWxkIGhhbmcgdGhlaXIgd2VhcG9ucyBpbiB0aGUgdHJlZS5cIixcbiAgICBcIldoZW4gYm95cyB3ZXJlIDIwIHllYXJzIG9sZCB0aGV5IGpvaW5lZCB0aGUgU3BhcnRhbiBhcm15LiBUaGV5IGFsd2F5cyB3b3JlIHJlZCBjbG9ha3Mgd2hlbiB0aGV5IHdlbnQgdG8gZmlnaHQsIGFuZCB3ZXJlIGtub3duIGZvciBiZWluZyB0aGUgdG91Z2hlc3Qgd2FycmlvcnMgaW4gR3JlZWNlIVwiLFxuICAgIFwiRXZlbiB0aG91Z2ggZ2lybHMgd2VyZW4ndCBpbiB0aGUgYXJteSwgdGhleSBoYWQgdG8gc3RheSBhY3RpdmUgc28gdGhleSBjb3VsZCBoYXZlIGhlYWx0aHkgYmFiaWVzLCBiZWNhdXNlIFNwYXJ0YW4gYmFiaWVzIGFsd2F5cyBoYWQgdG8gYmUgc3Ryb25nXCIsXG4gICAgXCJTcGFydGFucyBvbmx5IHdhbnRlZCB0aGUgYmVzdCwgc28gd2VhayBTcGFydGFuIGJhYmllcyB3ZXJlIGxlZnQgdG8gZGllLlwiLFxuICAgIFwiQm95cyBpbiBTcGFydGEgZGlkbid0IGdvIHRvIHNjaG9vbC4gQXMgc29vbiBhcyB0aGV5IHR1cm5lZCA3IHRoZXkgc3RhcnRlZCB0cmFpbmluZyBmb3IgdGhlIG1pbGl0YXJ5LiBQcmV0dHkgZGlmZmVyZW50IGZyb20gQXRoZW5zLCBodWg/XCIsXG4gICAgXCJTcGFydGFuIGJveXMgd2VyZSBkZWxpYmVyYXRlbHkga2VwdCBodW5ncnksIHNvIHRoZXkgaGFkIHRvIHJvYW0gYXJvdW5kIHN0ZWFsaW5nIGZvb2QgdG8gc3Vydml2ZS4gVGhpcyB0YXVnaHQgdGhlbSB1c2VmdWwgc2tpbGxzIGZvciBiYXR0bGUuXCJcbl07XG5HYW1lVG9vbHMuZ2FtZUNvbnRlbnRzID0gW1xuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIldlbGNvbWUhXCIsIFwiV2VsY29tZSB0byBHb29kIE9sJyBHcmVlY2UuPHA+PC9wPklmIHlvdSdyZSBwbGF5aW5nIG9uIGEgc21hbGwgZGV2aWNlLCB3ZSByZWNvbW1lbmQgdXNpbmcgbGFuZHNjYXBlIGZvciBzb21lIG9yIGFsbCBvZiB0aGUgcGFydHMgaW4gdGhpcyBnYW1lLlwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkxhYmVsKFwiZHJhZ3F1ZXN0aW9uXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuRHJhZ1RhcmdldHNRdWVzdGlvbihcIlBsYWNlIHRoZSBkYXRlcyBvbiB0b3Agb2YgdGhlaXIgbWF0Y2hpbmcgZXZlbnQuXCIsIFtcbiAgICAgICAgeyBuYW1lOiBcIjE4NTIgQi5DLlwiLCB0YXJnZXQ6IFwiUHlyYW1pZHMgYmVnaW4gdG8gYmUgYnVpbHRcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiNTAwIEIuQy5cIiwgdGFyZ2V0OiBcIkdyZWVrIENsYXNzaWNhbCBBZ2VcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiMCBCLkMuL0EuRC5cIiwgdGFyZ2V0OiBcIkNocmlzdCBpcyBib3JuXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjQxMCBBLkQuXCIsIHRhcmdldDogXCJUaGUgZmFsbCBvZiBSb21lXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjEwNjYgQS5ELlwiLCB0YXJnZXQ6ICBcIlRoZSBCYXR0bGUgb2YgSGFzdGluZ3NcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiMTk1MiBBLkQuXCIsIHRhcmdldDogXCJRdWVlbiBFbGl6YWJldGggSUkgY3Jvd25lZFwiIH1cbiAgICBdLCBmYWxzZSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5Db25kaXRpb24obmV3IEdhbWVUb29scy5Mb29wKHsgaW5kZXg6IFwiZHFfY29ycmVjdFwiIH0pLCBuZXcgR2FtZVRvb2xzLkxvb3AoeyBpbmRleDogXCJkcV9pbmNvcnJlY3RcIiB9KSksXG4gICAgbmV3IEdhbWVUb29scy5MYWJlbChcImRxX2NvcnJlY3RcIiksXG4gICAgbmV3IEdhbWVUb29scy5JbmZvQm94KFwiR3JlYXQgam9iIVwiLCBcIllvdSBtdXN0IGtub3cgd2hhdCB5b3UncmUgZG9pbmchXCIsIFwiQ29udGludWVcIiksXG4gICAgbmV3IEdhbWVUb29scy5Mb29wKHsgaW5kZXg6IFwiZmlyc3QtbWFwXCJ9KSxcbiAgICBuZXcgR2FtZVRvb2xzLkxhYmVsKFwiZHFfaW5jb3JyZWN0XCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIldob29wcyFcIiwgXCJMb29rcyBsaWtlIHNvbWV0aGluZyB3ZW50IHdyb25nIHRoZXJlLiBHaXZlIGl0IGFub3RoZXIgdHJ5IVwiLCBcIlRyeSBhZ2FpblwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkxvb3AoeyBpbmRleDogXCJkcmFncXVlc3Rpb25cIiB9KSxcbiAgICBuZXcgR2FtZVRvb2xzLkxhYmVsKFwiZmlyc3QtbWFwXCIpLFxuICAgIG5ldyBHcmVlY2VJbnRlcmFjdGl2ZU1hcChcIlNlbGVjdCB0aGUgY29udGluZW50IEdyZWVjZSBpcyBpbi5cIiwgXCJDb250aW5lbnRzLnN2Z1wiLCBbXG4gICAgICAgIFwiLmludGVyYWN0aXZlLWNvbnRpbmVudFwiXG4gICAgXSksXG4gICAgbmV3IEdhbWVUb29scy5JbmZvQm94KFwiTmljZSB3b3JrIVwiLCBcIkdyZWVjZSBpcyBsb2NhdGVkIGluIHNvdXRoZXJuIEV1cm9wZS5cIiwgXCJPS1wiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkxhYmVsKFwic2Vjb25kLW1hcFwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkJ1dHRvbkZpbmRlcihcIkF0aGVuczogRXhwbG9yZSB0aGUgaXRlbXMhXCIsIG51bGwsIFtcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcInJhaXNpbmdfaGFuZC5wbmdcIiwgXCJEZW1vY3JhY3lcIiksXG4gICAgICAgIEdhbWVUb29scy5pbWFnZUFuZFRleHQoXCJhY3JvcG9saXMuanBnXCIsIFwiQWNyb3BvbGlzXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwicGFydGhlbm9uLmpwZ1wiLCBcIlBhcnRoZW5vblwiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcImdpcmwuZ2lmXCIsIFwiR3JlZWsgZ2lybHNcIiksXG4gICAgICAgIEdhbWVUb29scy5pbWFnZUFuZFRleHQoXCJob3BsaXRlLmpwZ1wiLCBcIkhvcGxpdGVzXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwieW91bmdib3kuZ2lmXCIsIFwiWW91bmcgYm95XCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwiaG91c2UuZ2lmXCIsIFwiSG91c2VcIiksXG4gICAgICAgIEdhbWVUb29scy5pbWFnZUFuZFRleHQoXCJ0cmVlLnBuZ1wiLCBcIk9saXZlIHRyZWVcIilcbiAgICBdLCAwKSxcbiAgICBuZXcgR2FtZVRvb2xzLkNvbmRpdGlvbihuZXcgR2FtZVRvb2xzLkxvb3AoeyBpbmRleDogXCJ0aGlyZC1tYXBcIiB9KSwgbmV3IEdhbWVUb29scy5MYWJlbChcImZhbGx0aHJvdWdoXCIpKSxcbiAgICBuZXcgR2FtZVRvb2xzLkluZm9Cb3goXCJJbmZvcm1hdGlvblwiLCB7IHN0cmluZ192YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYXRoZW5zW0dhbWVUb29scy5sYXN0RGF0YV07XG4gICAgfX0sIFwiT0tcIiwgMCksXG4gICAgbmV3IEdhbWVUb29scy5Mb29wKHsgaW5kZXg6IFwic2Vjb25kLW1hcFwifSksXG4gICAgbmV3IEdhbWVUb29scy5MYWJlbChcInRoaXJkLW1hcFwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkJ1dHRvbkZpbmRlcihcIlNwYXJ0YTogRXhwbG9yZSB0aGUgaXRlbXMhXCIsIG51bGwsIFtcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcInRyZWUucG5nXCIsIFwiVHJlZVwiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcImhvcGxpdGUuanBnXCIsIFwiU29sZGllclwiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcImdpcmwuZ2lmXCIsIFwiU3BhcnRhbiBnaXJsc1wiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcImJhYmllcy5qcGdcIiwgXCJTcGFydGFuIGJhYmllc1wiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcInlvdW5nYm95LmdpZlwiLCBcIlNwYXJ0YW4gYm95c1wiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcInN0ZWFsaW5nLmpwZ1wiLCBcIlN0ZWFsaW5nXCIpXG4gICAgXSwgMCksXG4gICAgbmV3IEdhbWVUb29scy5Db25kaXRpb24obmV3IEdhbWVUb29scy5Mb29wKHsgaW5kZXg6IFwiZm91cnRoLW1hcFwiIH0pLCBuZXcgR2FtZVRvb2xzLkxhYmVsKFwiZmFsbHRocm91Z2hcIikpLFxuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIkluZm9ybWF0aW9uXCIsIHsgc3RyaW5nX3ZhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzcGFydGFbR2FtZVRvb2xzLmxhc3REYXRhXTtcbiAgICB9fSwgXCJPS1wiLCAwKSxcbiAgICBuZXcgR2FtZVRvb2xzLkxvb3AoeyBpbmRleDogXCJ0aGlyZC1tYXBcIn0pLFxuICAgIG5ldyBHYW1lVG9vbHMuTGFiZWwoXCJmb3VydGgtbWFwXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuRHJhZ1RhcmdldHNRdWVzdGlvbihcIk1vdW50IE9seW1wdXM6IE1hdGNoIHRoZSBzeW1ib2xzIHRvIHRoZSBnb2RzIGFuZCBnb2RkZXNzZXMuXCIsIFtcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSdsaWdodG5pbmcuc3ZnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPlpldXM8L2I+PGJyLz5JIG5lZWQgbXkgbGlnaHRuaW5nIGJvbHRcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J2hhcnAuc3ZnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkFwb2xsbzwvYj48YnIvPkkgY2FuJ3QgcGxheSBtdXNpYyB3aXRob3V0IGEgaGFycFwiIH0sXG4gICAgICAgIHsgbmFtZTogXCI8aW1nIHNyYz0ncG9tZWdyYW5hdGUuanBnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkhlcmE8L2I+PGJyLz5JIG5lZWQgbXkgcG9tZWdyYW5hdGVcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J3dpbmdlZF9ib290LmpwZyc+PC9pbWc+XCIsIHRhcmdldDogXCI8Yj5IZXJtZXM8L2I+PGJyLz5JIG5lZWQgbXkgd2luZ2VkIGJvb3RzXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSdyb3NlLnBuZyc+PC9pbWc+XCIsIHRhcmdldDogXCI8Yj5BcGhyb2RpdGU8L2I+PGJyLz5JIGxvdmUgbXkgcm9zZVwiIH0sXG4gICAgICAgIHsgbmFtZTogXCI8aW1nIHNyYz0nYm93X2FuZF9hcnJvdy5wbmcnPjwvaW1nPlwiLCB0YXJnZXQ6IFwiPGI+QXJ0ZW1pczwvYj48YnIvPkkgbmVlZCBteSBib3dcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J3doZWF0LnN2Zyc+PC9pbWc+XCIsIHRhcmdldDogXCI8Yj5EZW1ldGVyPC9iPjxici8+SSBuZWVkIG15IHdoZWF0XCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSd0cmlkZW50LnN2Zyc+PC9pbWc+XCIsIHRhcmdldDogXCI8Yj5Qb3NlaWRvbjwvYj48YnIvPkkgY2FuJ3QgZmluZCBteSB0cmlkZW50XCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSd3aW5lLnN2Zyc+PC9pbWc+XCIsIHRhcmdldDogXCI8Yj5EaW9ueXN1czwvYj48YnIvPkkgbmVlZCBteSB3aW5lXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSdoYW1tZXIuc3ZnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkhlcGhhZXN0dXM8L2I+PGJyLz5JIG5lZWQgbXkgaGFtbWVyXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSdzcGVhci5zdmcnPjwvaW1nPlwiLCB0YXJnZXQ6IFwiPGI+QXJlczwvYj48YnIvPkdpdmUgbWUgbXkgc3BlYXJcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J3RyZWUucG5nJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkF0aGVuYTwvYj48YnIvPkkgY2FuJ3QgZmluZCBteSBvbGl2ZSB0cmVlXCIgfSxcbiAgICBdLCB0cnVlLCB0cnVlKSxcbiAgICBuZXcgR2FtZVRvb2xzLkNvbmRpdGlvbihuZXcgR2FtZVRvb2xzLkxvb3AoeyBpbmRleDogXCJxdWl6XCIgfSksIG5ldyBHYW1lVG9vbHMuTGFiZWwoXCJmYWxsdGhyb3VnaFwiKSksXG4gICAgbmV3IEdhbWVUb29scy5JbmZvQm94KFwiTm9wZSFcIiwgXCJJdCBzZWVtcyB0aGF0IHlvdSBkaWRuJ3QgbWF0Y2ggdGhlIHN5bWJvbHMgcHJvcGVybHkuXCIsIFwiVHJ5IGFnYWluXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuTG9vcCh7IGluZGV4OiBcImZvdXJ0aC1tYXBcIiB9KSxcbiAgICBuZXcgR2FtZVRvb2xzLkxhYmVsKFwicXVpelwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkluZm9Cb3goXCJHcmVhdCBqb2IhXCIsIFwiVGhlIGdvZHMgYXJlIHBsZWFzZWQuXCIsIFwiT0tcIiksXG4gICAgbmV3IEdhbWVUb29scy5JbmZvQm94KFwiV2VsY29tZSB0byB0aGUgUXVpelwiLCBcIk5vdyB5b3UnbGwgYmUgdGVzdGVkIG9uIHlvdXIga25vd2xlZGdlIG9mIEF0aGVucywgU3BhcnRhLCBhbmQgTW91bnQgT2x5bXB1cy5cIiksXG4gICAgbmV3IEdhbWVUb29scy5NdWx0aXBsZUNob2ljZVF1ZXN0aW9uKFwiQXQgd2hhdCBhZ2UgZGlkIGJveXMgZnJvbSBTcGFydGEgc3RhcnQgZ29pbmcgdG8gc2Nob29sP1wiLCBbXG4gICAgICAgIHsgaHRtbDogXCI3XCIsIGNvcnJlY3Q6IHRydWV9LFxuICAgICAgICB7IGh0bWw6IFwiMTZcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiVGhleSBkaWRuJ3QhXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIldobyB3ZXJlIHRoZSB0ZW1wbGVzIG9uIHRoZSBBY3JvcG9saXMgYnVpbHQgZm9yP1wiLCBbXG4gICAgICAgIHsgaHRtbDogXCJUaGUgZ29kc1wiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIlJpY2ggcGVvcGxlXCIgfSxcbiAgICAgICAgeyBodG1sOiBcIlNvbGRpZXJzXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIldoaWNoIGdvZCBvciBnb2RkZXNzIGdhdmUgYW4gb2xpdmUgdHJlZSB0byBBdGhlbnM/XCIsIFtcbiAgICAgICAgeyBodG1sOiBcIkF0aGVuYVwiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIkFydGVtaXNcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiQXBocm9kaXRlXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIkF0IHdoYXQgYWdlIGRpZCBnaXJscyBmcm9tIFNwYXJ0YSBzdGFydCBnb2luZyB0byBzY2hvb2w/XCIsIFtcbiAgICAgICAgeyBodG1sOiBcIjdcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiMTZcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiVGhleSBkaWRuJ3QhXCIsIGNvcnJlY3Q6IHRydWUgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIldoaWNoIGdvZCB3YXMgd29yc2hpcHBlZCBpbiB0aGUgUGFydGhlbm9uP1wiLCBbXG4gICAgICAgIHsgaHRtbDogXCJBdGhlbmFcIiwgY29ycmVjdDogdHJ1ZX0sXG4gICAgICAgIHsgaHRtbDogXCJaZXVzXCIgfSxcbiAgICAgICAgeyBodG1sOiBcIkFyaXN0b3RsZVwiIH1cbiAgICBdLCB0cnVlKSxcbiAgICBuZXcgR2FtZVRvb2xzLk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24oXCJTcGFydGFuIGdpcmxzIGtlcHQgZml0IHNvIHRoZXkgY291bGQgaGF2ZS4uLj9cIiwgW1xuICAgICAgICB7IGh0bWw6IFwiSGVhbHRoeSBiYWJpZXNcIiwgY29ycmVjdDogdHJ1ZX0sXG4gICAgICAgIHsgaHRtbDogXCJGdW5cIiB9LFxuICAgICAgICB7IGh0bWw6IFwiQSBsYXVnaFwiIH1cbiAgICBdLCB0cnVlKSxcbiAgICBuZXcgR2FtZVRvb2xzLk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24oXCJTcGFydGFuIGJveXMgd2VyZSBrZXB0IGh1bmdyeSwgc28gdGhleSBoYWQgdG8uLi5cIiwgW1xuICAgICAgICB7IGh0bWw6IFwiU3RlYWwgZm9vZCFcIiwgY29ycmVjdDogdHJ1ZX0sXG4gICAgICAgIHsgaHRtbDogXCJGaWdodCBhIGxvdCFcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiQm9ycm93IG1vbmV5IVwiIH1cbiAgICBdLCB0cnVlKSxcbiAgICBuZXcgR2FtZVRvb2xzLk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24oXCJXaGF0IHdhcyBTcGFydGEgc3Vycm91bmRlZCBieSB0byBwcm90ZWN0IGl0P1wiLCBbXG4gICAgICAgIHsgaHRtbDogXCJNb3VudGFpbnNcIiwgY29ycmVjdDogdHJ1ZX0sXG4gICAgICAgIHsgaHRtbDogXCJBbiBhcm15IG9mIFNwYXJ0YW5zXCIgfSxcbiAgICAgICAgeyBodG1sOiBcIk1hY2hpbmUgZ3Vuc1wiIH1cbiAgICBdLCB0cnVlKSxcbiAgICBuZXcgR2FtZVRvb2xzLk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24oXCJXaGF0IHR5cGUgb2YgU3BhcnRhbiBiYWJ5IHdhcyBsZWZ0IHRvIGRpZT9cIiwgW1xuICAgICAgICB7IGh0bWw6IFwiV2VhayBiYWJpZXNcIiwgY29ycmVjdDogdHJ1ZX0sXG4gICAgICAgIHsgaHRtbDogXCJGYXQgYmFiaWVzXCIgfSxcbiAgICAgICAgeyBodG1sOiBcIkluY29uc29sYWJsZSBiYWJpZXNcIiB9XG4gICAgXSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5NdWx0aXBsZUNob2ljZVF1ZXN0aW9uKFwiV2hpY2ggZ29kIHdhcyByZXNwb25zaWJsZSBmb3IgcHJvdGVjdGluZyBBdGhlbnM/XCIsIFtcbiAgICAgICAgeyBodG1sOiBcIkF0aGVuYVwiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIlBvc2VpZG9uXCIgfSxcbiAgICAgICAgeyBodG1sOiBcIlBsYXRvXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTGFiZWwoXCJoYWNrMVwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24oXCJUaGUgdHdlbHZlIGdvZHMgYW5kIGdvZGRlc3NlcyBsaXZlZCBvbi4uLlwiLCBbXG4gICAgICAgIHsgaHRtbDogXCJNb3VudCBPbHltcHVzXCIsIGNvcnJlY3Q6IHRydWV9LFxuICAgICAgICB7IGh0bWw6IFwiTXkgcm9vZlwiIH0sXG4gICAgICAgIHsgaHRtbDogXCJBbiBpc2xhbmQgaW4gR3JlZWNlXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIlRoYW5rcyBmb3IgcGxheWluZyFcIiwgXCJJZiB5b3Ugd2FudCB0byBwbGF5IGFnYWluLCB5b3UgY2FuIHJlZnJlc2ggdGhlIHBhZ2UuXCIsIG51bGwpLFxuXTtcbiQod2luZG93KS5vbihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgJChcIi5zZS1wcmUtY29uXCIpLmZhZGVPdXQoXCJzbG93XCIpO1xuICAgIEdhbWVUb29scy5tb25rZXlQYXRjaCgpO1xuICAgIEdhbWVUb29scy5yZXNldFN5c3RlbSgpO1xuICAgIEdhbWVUb29scy5yZXN0YXJ0KCk7XG59KTsiXX0=
