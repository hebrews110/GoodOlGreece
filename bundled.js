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
    var InfoBox = /** @class */ (function (_super) {
        __extends(InfoBox, _super);
        function InfoBox(title, text, buttonText) {
            if (buttonText === void 0) { buttonText = "OK"; }
            var _this = _super.call(this) || this;
            _this.title = title;
            _this.text = text;
            _this.buttonText = buttonText;
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
                _super.prototype.redisplay.call(this);
            }
        };
        InfoBox.prototype.displayNext = function () {
            this.wantsToRedisplay = false;
            if (this.modalDisplayed) {
                $("#question-dialog").modal('hide');
            }
            else {
                _super.prototype.displayNext.call(this);
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
            }, 1000);
        };
        return InfoBox;
    }(DisplayedItem));
    GameTools.InfoBox = InfoBox;
    var Delay = /** @class */ (function (_super) {
        __extends(Delay, _super);
        function Delay(time) {
            var _this = _super.call(this) || this;
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
    var LevelChoice = /** @class */ (function (_super) {
        __extends(LevelChoice, _super);
        function LevelChoice(levelMarkups) {
            var _this = _super.call(this, "Choose a level", "", null) || this;
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
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            return _this;
        }
        Label.prototype.display = function () {
            this.displayNext();
        };
        return Label;
    }(GameTools.DisplayedItem));
    GameTools.Label = Label;
    var Loop = /** @class */ (function (_super) {
        __extends(Loop, _super);
        function Loop(loopInfo, times) {
            if (times === void 0) { times = -1; }
            var _this = _super.call(this) || this;
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
    var SystemReset = /** @class */ (function (_super) {
        __extends(SystemReset, _super);
        function SystemReset() {
            return _super !== null && _super.apply(this, arguments) || this;
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
    var DragTargetsQuestion = /** @class */ (function (_super) {
        __extends(DragTargetsQuestion, _super);
        function DragTargetsQuestion(title, items, shuffleTargets, shuffleOptions) {
            if (shuffleTargets === void 0) { shuffleTargets = false; }
            if (shuffleOptions === void 0) { shuffleOptions = false; }
            var _this = _super.call(this, title, "", "Check") || this;
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
            _super.prototype.buttonCallback.call(this, e);
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
                $draggable.detach().appendTo($(this));
                console.log(this);
                if ($(this).is($itemsDiv))
                    $draggable.css({ "position": "relative" });
            };
            var outFunction = function (event, ui) {
                if ($(this).hasClass("target") && $(this).children(".drag-item").hasClass("ui-draggable-dragging")) {
                    console.log($(this).children().get(0));
                    $(this).children("i").hide();
                    $(this).children("span").show();
                    $(this).tooltip('disable');
                }
            };
            var dragInfo = {
                containment: $('body'),
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
                }
            };
            $targetsDiv.children("div").droppable().on("drop", dropFunction).on("dropout", outFunction).on("gt.before_drop", gtBeforeDropFunction);
            $itemsDiv.droppable().on("drop", dropFunction).on("dropout", outFunction);
            $itemsDiv.children("div").draggable(dragInfo);
        };
        DragTargetsQuestion.alwaysBeRight = false;
        return DragTargetsQuestion;
    }(InfoBox));
    GameTools.DragTargetsQuestion = DragTargetsQuestion;
    var FunctionDisplayedItem = /** @class */ (function (_super) {
        __extends(FunctionDisplayedItem, _super);
        function FunctionDisplayedItem(func) {
            var _this = _super.call(this) || this;
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
    var Condition = /** @class */ (function (_super) {
        __extends(Condition, _super);
        function Condition(trueStatement, falseStatement, customCondition) {
            var _this = _super.call(this) || this;
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
    var InteractiveSVG = /** @class */ (function (_super) {
        __extends(InteractiveSVG, _super);
        function InteractiveSVG(title, imgSrc, interactiveComponents) {
            var _this = _super.call(this, title, "", null) || this;
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
            _super.prototype.undisplay.call(this);
            $(window).off("resize", InteractiveSVG.scrollHandler);
        };
        return InteractiveSVG;
    }(InfoBox));
    GameTools.InteractiveSVG = InteractiveSVG;
    var Finder = /** @class */ (function () {
        function Finder(parent, numItems) {
            this.parent = parent;
            this.numItems = numItems;
            this.itemIndexes = [];
            this.reset();
        }
        Finder.prototype.reset = function () {
            this.itemIndexes = [];
            this.itemsFound = 0;
        };
        Finder.prototype.setTitle = function () {
            if (this.itemsFound > 0)
                $("#question-dialog .modal-title").text("You have found " + this.itemsFound + " of " + this.numItems + " items.");
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
        return Finder;
    }());
    GameTools.Finder = Finder;
    var InteractiveSVGFinder = /** @class */ (function (_super) {
        __extends(InteractiveSVGFinder, _super);
        function InteractiveSVGFinder(title, imgSrc, interactiveComponents, numItems) {
            var _this = _super.call(this, title, imgSrc, interactiveComponents) || this;
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
            _super.prototype.reset.call(this);
        };
        return InteractiveSVGFinder;
    }(InteractiveSVG));
    GameTools.InteractiveSVGFinder = InteractiveSVGFinder;
    var ButtonFinder = /** @class */ (function (_super) {
        __extends(ButtonFinder, _super);
        function ButtonFinder(title, instructions, buttons) {
            var _this = _super.call(this, title, instructions, null) || this;
            _this.instructions = instructions;
            _this.buttons = buttons;
            _this.didDisplay = false;
            _this.finder = new Finder(_this, buttons.length);
            return _this;
        }
        ButtonFinder.prototype.reset = function () {
            if (this.finder != null)
                this.finder.reset();
            _super.prototype.reset.call(this);
        };
        ButtonFinder.prototype.displayNext = function () {
            if (this.didDisplay)
                GameTools.lastResult = false;
            else
                GameTools.lastResult = this.finder.finished();
            console.log(this.finder.$componentFound.get(0));
            GameTools.lastData = this.finder.$componentFound.data("index");
            _super.prototype.displayNext.call(this);
        };
        ButtonFinder.prototype.display = function () {
            if (this.finder.finished()) {
                this.didDisplay = false;
                this.displayNext();
            }
            else {
                this.didDisplay = true;
                _super.prototype.display.call(this);
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
                $button.data("index", index);
                $button.click(function (e) {
                    $finderButtons.children("button").prop("disabled", true);
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
    var TrueFalseQuestion = /** @class */ (function (_super) {
        __extends(TrueFalseQuestion, _super);
        function TrueFalseQuestion(question, correctAnswer) {
            var _this = _super.call(this, question, null, "True") || this;
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
            _super.prototype.buttonCallback.call(this, e);
        };
        TrueFalseQuestion.prototype.dialogCreated = function () {
            var $footer = $("#question-dialog .modal-footer");
            $footer.append($("<button></button>").addClass("btn btn-secondary").text("False").click(this.buttonCallback));
        };
        return TrueFalseQuestion;
    }(InfoBox));
    GameTools.TrueFalseQuestion = TrueFalseQuestion;
    var MultipleChoiceQuestion = /** @class */ (function (_super) {
        __extends(MultipleChoiceQuestion, _super);
        function MultipleChoiceQuestion(question, choices, shouldReDisplay) {
            if (shouldReDisplay === void 0) { shouldReDisplay = false; }
            var _this = _super.call(this, "Choose one of the choices.", question, null) || this;
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
})(GameTools || (GameTools = {}));
var GreeceInteractiveMap = /** @class */ (function (_super) {
    __extends(GreeceInteractiveMap, _super);
    function GreeceInteractiveMap() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    new GameTools.DragTargetsQuestion("Can you put these in order?", [
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
    ]),
    new GameTools.Condition(new GameTools.Loop({ index: "third-map" }), new GameTools.Label("fallthrough")),
    new GameTools.InfoBox("Information", { string_val: function () {
            return athens[GameTools.lastData];
        } }, "OK"),
    new GameTools.Loop({ index: "second-map" }),
    new GameTools.Label("third-map"),
    new GameTools.ButtonFinder("Sparta: Explore the items!", null, [
        GameTools.imageAndText("tree.png", "Tree"),
        GameTools.imageAndText("hoplite.jpg", "Soldier"),
        GameTools.imageAndText("girl.gif", "Spartan girls"),
        GameTools.imageAndText("babies.jpg", "Spartan babies"),
        GameTools.imageAndText("youngboy.gif", "Spartan boys"),
        GameTools.imageAndText("stealing.jpg", "Stealing")
    ]),
    new GameTools.Condition(new GameTools.Loop({ index: "fourth-map" }), new GameTools.Label("fallthrough")),
    new GameTools.InfoBox("Information", { string_val: function () {
            return sparta[GameTools.lastData];
        } }, "OK"),
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
    GameTools.resetSystem();
    GameTools.restart();
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSw4REFBOEQ7QUFDOUQsZ0VBQWdFO0FBQ2hFLGlFQUFpRTtBQUNqRSxrRUFBa0U7QUFDbEUsaUVBQWlFOzs7Ozs7Ozs7Ozs7OztBQU9qRSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRztJQUMxQixPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUE7QUFDRCxJQUFVLFNBQVMsQ0ErdUJsQjtBQS91QkQsV0FBVSxTQUFTO0lBQ2YsQ0FBQyxVQUFTLENBQUM7UUFDTixDQUFDLENBQUMsRUFBVSxDQUFDLFNBQVMsR0FBRyxVQUFTLFNBQVM7WUFDeEMsU0FBUyxPQUFPLENBQUMsQ0FBQztnQkFDZCxLQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLENBQUM7Z0JBQ3JHLE9BQU8sQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFBLENBQUM7WUFDRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUV0QyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRWYsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDUCxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2dCQUVILEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNoQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMxQjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO0lBQ0wsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDQSxzQkFBWSxHQUFHLENBQUMsQ0FBQztJQUNqQix1QkFBYSxHQUFHLENBQUMsQ0FBQztJQUNsQixvQkFBVSxHQUFZLEtBQUssQ0FBQztJQUM1QixrQkFBUSxHQUFRLElBQUksQ0FBQztJQUNyQixzQkFBWSxHQUE4QixFQUFFLENBQUM7SUFDN0MseUJBQWUsR0FBRyxVQUFTLE9BQWdDO1FBQ2xFLElBQUcsVUFBQSxhQUFhLElBQUksVUFBQSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN6QyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLENBQUMsVUFBQSxhQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxPQUFPLFVBQUEsWUFBWSxDQUFDLEVBQUUsVUFBQSxhQUFhLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7SUFDUyw0QkFBa0IsR0FBRztRQUM1QixPQUFPLFVBQUEsWUFBWSxDQUFDLFVBQUEsYUFBYSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDO0lBRUY7UUFLSTtZQUpRLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1lBSzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBTk0sb0NBQVksR0FBbkI7WUFDSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDOUIsQ0FBQztRQUtELCtCQUFPLEdBQVA7WUFDSSxPQUFPLFVBQUEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsK0JBQU8sR0FBUDtZQUNJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUM7UUFDRCxpQ0FBUyxHQUFUO1lBQ0ksSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDL0IsQ0FBQztRQUNELG1DQUFXLEdBQVg7WUFDSSxJQUFJLFVBQUEsZUFBZSxJQUFJLElBQUk7Z0JBQ3ZCLE9BQU8sVUFBQSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7O2dCQUU3QixNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNNLGlDQUFTLEdBQWhCO1lBQ0ksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzNCLElBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQztnQkFDVixNQUFNLDBDQUEwQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQzNELFVBQVUsQ0FBQztnQkFDUCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUNNLG1DQUFXLEdBQWxCO1lBQ0ksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM5QixVQUFVLENBQUM7Z0JBQ1AsSUFBRyxJQUFJLEtBQUssSUFBSTtvQkFDWixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUNELDZCQUFLLEdBQUw7UUFFQSxDQUFDO1FBQ0wsb0JBQUM7SUFBRCxDQTdDQSxBQTZDQyxJQUFBO0lBN0NxQix1QkFBYSxnQkE2Q2xDLENBQUE7SUFFRDs7O01BR0U7SUFDRixTQUFnQixPQUFPLENBQUksQ0FBTTtRQUM3QixJQUFJLENBQVMsRUFBRSxDQUFJLEVBQUUsQ0FBUyxDQUFDO1FBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ1o7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFUZSxpQkFBTyxVQVN0QixDQUFBO0lBSUQ7UUFBNkIsMkJBQWE7UUFHdEMsaUJBQXNCLEtBQWlCLEVBQVksSUFBZ0IsRUFBWSxVQUE2QjtZQUE3QiwyQkFBQSxFQUFBLGlCQUE2QjtZQUE1RyxZQUNJLGlCQUFPLFNBQ1Y7WUFGcUIsV0FBSyxHQUFMLEtBQUssQ0FBWTtZQUFZLFVBQUksR0FBSixJQUFJLENBQVk7WUFBWSxnQkFBVSxHQUFWLFVBQVUsQ0FBbUI7WUFGcEcsb0JBQWMsR0FBRyxLQUFLLENBQUM7WUFDdkIsc0JBQWdCLEdBQUcsS0FBSyxDQUFDOztRQUdqQyxDQUFDO1FBQ1MsK0JBQWEsR0FBdkI7UUFFQSxDQUFDO1FBQ1MsZ0NBQWMsR0FBeEIsVUFBeUIsQ0FBb0I7WUFDekMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCwyQkFBUyxHQUFUO1lBQ0ksSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUM3QixJQUFHLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3BCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN2QztpQkFBTTtnQkFDSCxpQkFBTSxTQUFTLFdBQUUsQ0FBQzthQUNyQjtRQUNMLENBQUM7UUFDRCw2QkFBVyxHQUFYO1lBQ0ksSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUM5QixJQUFHLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3BCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN2QztpQkFBTTtnQkFDSCxpQkFBTSxXQUFXLFdBQUUsQ0FBQzthQUN2QjtRQUNMLENBQUM7UUFDRCx5QkFBTyxHQUFQO1lBQUEsaUJBOENDO1lBN0NHLFVBQVUsQ0FBQztnQkFDUCxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbkMsSUFBRyxLQUFJLENBQUMsS0FBSyxJQUFJLElBQUk7b0JBQ2pCLENBQUMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7O29CQUVqRSxDQUFDLENBQUMsK0JBQStCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2hELElBQUcsS0FBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7b0JBQ2xCLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN6QyxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2lCQUNsRTtxQkFBTTtvQkFDSCxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzNDLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUM1QztnQkFFRCx5QkFBeUI7Z0JBQ3pCLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM1QyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN0SCxJQUFHLEtBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxJQUFJLEtBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFO29CQUM5RCxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEMsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzNDLENBQUMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7aUJBQ2pGO3FCQUFNO29CQUNILENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDOUM7Z0JBQ0QsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixDQUFDLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hELENBQUMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDO29CQUNyRCxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQztnQkFDSCxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDckQsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFFNUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFO29CQUNyQyxLQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztvQkFDNUIsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN2QyxJQUFHLEtBQUksQ0FBQyxnQkFBZ0I7d0JBQ3BCLEtBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7d0JBRWpCLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDL0IsQ0FBQyxDQUFDLENBQUM7WUFFUixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDWixDQUFDO1FBQ0wsY0FBQztJQUFELENBM0VBLEFBMkVDLENBM0U0QixhQUFhLEdBMkV6QztJQTNFWSxpQkFBTyxVQTJFbkIsQ0FBQTtJQUVEO1FBQTJCLHlCQUFhO1FBQ3BDLGVBQXNCLElBQVk7WUFBbEMsWUFDSSxpQkFBTyxTQUNWO1lBRnFCLFVBQUksR0FBSixJQUFJLENBQVE7O1FBRWxDLENBQUM7UUFDRCx1QkFBTyxHQUFQO1lBQUEsaUJBSUM7WUFIRyxVQUFVLENBQUM7Z0JBQ1AsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUNMLFlBQUM7SUFBRCxDQVRBLEFBU0MsQ0FUMEIsYUFBYSxHQVN2QztJQVRZLGVBQUssUUFTakIsQ0FBQTtJQUNEO1FBQWlDLCtCQUFPO1FBQ3BDLHFCQUFzQixZQUE0QjtZQUFsRCxZQUNJLGtCQUFNLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FDcEM7WUFGcUIsa0JBQVksR0FBWixZQUFZLENBQWdCOztRQUVsRCxDQUFDO1FBQ1MsbUNBQWEsR0FBdkI7WUFDSSxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0MsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xDLFVBQVUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSztnQkFFckMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUNWLFNBQVMsQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbEQsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFDSCxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDTCxrQkFBQztJQUFELENBckJBLEFBcUJDLENBckJnQyxPQUFPLEdBcUJ2QztJQXJCWSxxQkFBVyxjQXFCdkIsQ0FBQTtJQUNELFNBQWdCLFlBQVksQ0FBQyxHQUFZLEVBQUUsR0FBVztRQUNsRCxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUM3RCxDQUFDO0lBSmUsc0JBQVksZUFJM0IsQ0FBQTtJQUNELFNBQWdCLGtCQUFrQixDQUFDLEdBQVcsRUFBRSxHQUFXO1FBQ3ZELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDNUMsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSGUsNEJBQWtCLHFCQUdqQyxDQUFBO0lBQ0QsU0FBZ0Isb0JBQW9CLENBQUMsU0FBcUIsRUFBRSxFQUFlO1FBQ3ZFLElBQUcsQ0FBQyxFQUFFO1lBQ0YsRUFBRSxHQUFHLGNBQVksQ0FBQyxDQUFDO1FBQ3ZCLElBQUcsU0FBUyxDQUFDLEtBQUssRUFBRTtZQUNoQixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM5QyxLQUFLLENBQUMsT0FBTyxHQUFHO2dCQUNaLEVBQUUsRUFBRSxDQUFDO1lBQ1QsQ0FBQyxDQUFBO1lBQ0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNwQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDaEI7O1lBQ0csRUFBRSxFQUFFLENBQUM7SUFDYixDQUFDO0lBWmUsOEJBQW9CLHVCQVluQyxDQUFBO0lBRUQ7UUFBMkIseUJBQXVCO1FBQzlDLGVBQW1CLElBQWdCO1lBQW5DLFlBQ0ksaUJBQU8sU0FDVjtZQUZrQixVQUFJLEdBQUosSUFBSSxDQUFZOztRQUVuQyxDQUFDO1FBQ0QsdUJBQU8sR0FBUDtZQUNJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBQ0wsWUFBQztJQUFELENBUEEsQUFPQyxDQVAwQixTQUFTLENBQUMsYUFBYSxHQU9qRDtJQVBZLGVBQUssUUFPakIsQ0FBQTtJQUtEO1FBQTBCLHdCQUF1QjtRQUc3QyxjQUFtQixRQUFrQixFQUFTLEtBQVU7WUFBVixzQkFBQSxFQUFBLFNBQVMsQ0FBQztZQUF4RCxZQUNJLGlCQUFPLFNBS1Y7WUFOa0IsY0FBUSxHQUFSLFFBQVEsQ0FBVTtZQUFTLFdBQUssR0FBTCxLQUFLLENBQUs7WUFEaEQsY0FBUSxHQUFHLENBQUMsQ0FBQztZQUdqQixJQUFHLE9BQU8sS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxJQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUM7Z0JBQ2hFLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztpQkFDN0IsSUFBRyxLQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUN4QyxLQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O1FBQ3RDLENBQUM7UUFDRCw2QkFBNkI7UUFDN0Isc0JBQU8sR0FBUDtZQUNJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFDRCxnQ0FBaUIsR0FBakI7WUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQztRQUNELHNCQUFPLEdBQVA7WUFBQSxpQkErQkM7WUE5QkcsSUFBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBRTdDLElBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLEVBQUU7b0JBQ3ZDLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDN0MsTUFBTSx1REFBdUQsQ0FBQztvQkFDbEUsSUFBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUTt3QkFDdEIsVUFBQSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7O3dCQUVwQyxVQUFBLGFBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztpQkFDNUM7cUJBQU07b0JBQ0gsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLFlBQVksS0FBSyxFQUFsQixDQUFrQixDQUFDLENBQUM7b0JBQ3BFLElBQUksVUFBUSxHQUFHLElBQUksQ0FBQztvQkFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7d0JBQ1QsSUFBSSxLQUFLLEdBQUksQ0FBVyxDQUFDO3dCQUN6QixJQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7NEJBQ2xDLFVBQVEsR0FBRyxLQUFLLENBQUM7NEJBQ2pCLE9BQU8sSUFBSSxDQUFDO3lCQUNmO3dCQUNELE9BQU8sS0FBSyxDQUFDO29CQUNqQixDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFHLFVBQVEsSUFBSSxJQUFJO3dCQUNmLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQ3BELFVBQUEsYUFBYSxHQUFHLFVBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDdEM7Z0JBQ0QsVUFBQSxhQUFhLElBQUksQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDbkI7WUFDRCxJQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztnQkFDYixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELG9CQUFLLEdBQUw7WUFDSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBQ0wsV0FBQztJQUFELENBdERBLEFBc0RDLENBdER5QixTQUFTLENBQUMsYUFBYSxHQXNEaEQ7SUF0RFksY0FBSSxPQXNEaEIsQ0FBQTtJQUNELFNBQVMsYUFBYSxDQUFDLFFBQWtCLEVBQUUsS0FBVTtRQUFWLHNCQUFBLEVBQUEsU0FBUyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRDtRQUFpQywrQkFBdUI7UUFBeEQ7O1FBS0EsQ0FBQztRQUpHLDZCQUFPLEdBQVA7WUFDSSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDTCxrQkFBQztJQUFELENBTEEsQUFLQyxDQUxnQyxTQUFTLENBQUMsYUFBYSxHQUt2RDtJQUxZLHFCQUFXLGNBS3ZCLENBQUE7SUFDRCxTQUFnQixXQUFXO1FBQ3ZCLFVBQUEsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLGFBQWE7WUFDOUIsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUplLHFCQUFXLGNBSTFCLENBQUE7SUFDRCxTQUFnQixPQUFPO1FBQ25CLElBQUcsVUFBQSxZQUFZLENBQUMsVUFBQSxhQUFhLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUMzQyxVQUFBLFlBQVksQ0FBQyxVQUFBLGFBQWEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQzNDO1FBQ0QsVUFBQSxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLFVBQUEsWUFBWSxDQUFDLFVBQUEsYUFBYSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQU5lLGlCQUFPLFVBTXRCLENBQUE7SUFNRCxTQUFTLG9CQUFvQixDQUFDLE9BQWU7UUFDekMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlDLElBQUcsT0FBTyxFQUFFO1lBQ1IsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUN6QztJQUNMLENBQUM7SUFDRCxTQUFnQixRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO1FBQzFCLENBQUMsSUFBSSxHQUFHLENBQUM7UUFDVCxDQUFDLElBQUksR0FBRyxDQUFDO1FBRVQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUNqQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQ3hDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsRUFDWCxDQUFDLEdBQW9CLENBQUMsRUFDdEIsQ0FBQyxHQUFvQixDQUFDLEVBQ3RCLENBQUMsR0FBb0IsQ0FBQyxDQUFDO1FBRTNCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3BCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjthQUFNLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQzdCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjthQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQzlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjthQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQzlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjthQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQzlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjthQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQzlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyQjtRQUNELCtDQUErQztRQUMvQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztR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QUFJLEVBQUUsT0FBTyxFQUFFO0tBQ3BCLEVBQUUsSUFBSSxDQUFDO0lBQ1IsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUM1QixJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQywyQ0FBMkMsRUFBRTtRQUM5RSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQztRQUN2QyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7UUFDbkIsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUU7S0FDbEMsRUFBRSxJQUFJLENBQUM7SUFDUixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsc0RBQXNELEVBQUUsSUFBSSxDQUFDO0NBQzdHLENBQUM7QUFDRixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtJQUNqQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN4QixTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9qcXVlcnkvaW5kZXguZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9qcXVlcnl1aS9pbmRleC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJub2RlX21vZHVsZXMvQHR5cGVzL2Jvb3RzdHJhcC9pbmRleC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJub2RlX21vZHVsZXMvQHR5cGVzL2Jyb3dzZXJpZnkvaW5kZXguZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9tb2Rlcm5penIvaW5kZXguZC50c1wiIC8+XG5cblxuZGVjbGFyZSBpbnRlcmZhY2UgU3RyaW5nIHtcbiAgICBzdHJpbmdfdmFsKCk6IHN0cmluZztcbn1cblxuU3RyaW5nLnByb3RvdHlwZS5zdHJpbmdfdmFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5uYW1lc3BhY2UgR2FtZVRvb2xzIHtcbiAgICAoZnVuY3Rpb24oJCkge1xuICAgICAgICAoJC5mbiBhcyBhbnkpLnJhbmRvbWl6ZSA9IGZ1bmN0aW9uKGNoaWxkRWxlbSkge1xuICAgICAgICAgICAgZnVuY3Rpb24gc2h1ZmZsZShvKSB7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBqLCB4LCBpID0gby5sZW5ndGg7IGk7IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKSwgeCA9IG9bLS1pXSwgb1tpXSA9IG9bal0sIG9bal0gPSB4KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW1zID0gJHRoaXMuY2hpbGRyZW4oY2hpbGRFbGVtKTtcbiAgICBcbiAgICAgICAgICAgICAgICBzaHVmZmxlKGVsZW1zKTtcbiAgICBcbiAgICAgICAgICAgICAgICBlbGVtcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRldGFjaCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgIFxuICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgZWxlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYXBwZW5kKGVsZW1zW2ldKTsgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTsgICAgXG4gICAgICAgIH1cbiAgICB9KShqUXVlcnkpO1xuICAgIGV4cG9ydCBsZXQgY3VycmVudExldmVsID0gMDtcbiAgICBleHBvcnQgbGV0IGNvbnRlbnRzSW5kZXggPSAwO1xuICAgIGV4cG9ydCBsZXQgbGFzdFJlc3VsdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGV4cG9ydCBsZXQgbGFzdERhdGE6IGFueSA9IG51bGw7XG4gICAgZXhwb3J0IGxldCBnYW1lQ29udGVudHM6IEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtW10gPSBbXTtcbiAgICBleHBvcnQgbGV0IGRlZmF1bHROZXh0SXRlbSA9IGZ1bmN0aW9uKGN1cnJlbnQ6IEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtKTogR2FtZVRvb2xzLkRpc3BsYXllZEl0ZW0ge1xuICAgICAgICBpZihjb250ZW50c0luZGV4ID09IGdhbWVDb250ZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gbmV4dCBpdGVtc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR2V0IGZyb20gaW5kZXggXCIgKyAoY29udGVudHNJbmRleCArIDEpKTtcbiAgICAgICAgcmV0dXJuIGdhbWVDb250ZW50c1srK2NvbnRlbnRzSW5kZXhdO1xuICAgIH07XG4gICAgZXhwb3J0IGxldCBjdXJyZW50bHlEaXNwbGF5ZWQgPSBmdW5jdGlvbigpOiBHYW1lVG9vbHMuRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIHJldHVybiBnYW1lQ29udGVudHNbY29udGVudHNJbmRleF07XG4gICAgfTtcblxuICAgIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgcHJpdmF0ZSBfaXNEaXNwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHB1YmxpYyBpc0Rpc3BsYXlpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNEaXNwbGF5aW5nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy5faXNEaXNwbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgbXlJbmRleCgpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIGdhbWVDb250ZW50cy5pbmRleE9mKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLl9pc0Rpc3BsYXlpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHVuZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuX2lzRGlzcGxheWluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGdldE5leHRJdGVtKCk6IERpc3BsYXllZEl0ZW0ge1xuICAgICAgICAgICAgaWYgKGRlZmF1bHROZXh0SXRlbSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0TmV4dEl0ZW0odGhpcyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gZGVmYXVsdCBuZXh0IGl0ZW0gcHJvdmlkZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIHJlZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMubXlJbmRleCgpO1xuICAgICAgICAgICAgaWYoaW5kZXggPT0gLTEpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJyZWRpc3BsYXkoKSByZXF1aXJlcyBhbiBpbi1hcnJheSBlbGVtZW50XCI7XG4gICAgICAgICAgICB0aGlzLnVuZGlzcGxheSgpO1xuICAgICAgICAgICAgdmFyIGxvb3AgPSBjb25zdHJ1Y3RMb29wKHsgaW5kZXg6IGluZGV4LCByZWxhdGl2ZTogZmFsc2V9KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvb3AuZGlzcGxheSgpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGRpc3BsYXlOZXh0KCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy51bmRpc3BsYXkoKTtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5nZXROZXh0SXRlbSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYoaXRlbSAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldCgpOiB2b2lkIHtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgKiBTaHVmZmxlcyBhcnJheSBpbiBwbGFjZS5cbiAgICAqIEBwYXJhbSB7QXJyYXl9IGEgaXRlbXMgQW4gYXJyYXkgY29udGFpbmluZyB0aGUgaXRlbXMuXG4gICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gc2h1ZmZsZTxUPihhOiBUW10pOiBUW10ge1xuICAgICAgICBsZXQgajogbnVtYmVyLCB4OiBULCBpOiBudW1iZXI7XG4gICAgICAgIGZvciAoaSA9IGEubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgeCA9IGFbaV07XG4gICAgICAgICAgICBhW2ldID0gYVtqXTtcbiAgICAgICAgICAgIGFbal0gPSB4O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBpbnRlcmZhY2UgR2FtZVN0cmluZyB7XG4gICAgICAgIHN0cmluZ192YWwoKTogc3RyaW5nO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgSW5mb0JveCBleHRlbmRzIERpc3BsYXllZEl0ZW0ge1xuICAgICAgICBwcml2YXRlIG1vZGFsRGlzcGxheWVkID0gZmFsc2U7XG4gICAgICAgIHByaXZhdGUgd2FudHNUb1JlZGlzcGxheSA9IGZhbHNlO1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdGl0bGU6IEdhbWVTdHJpbmcsIHByb3RlY3RlZCB0ZXh0OiBHYW1lU3RyaW5nLCBwcm90ZWN0ZWQgYnV0dG9uVGV4dDogR2FtZVN0cmluZyA9IFwiT0tcIikge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgZGlhbG9nQ3JlYXRlZCgpOiB2b2lkIHtcblxuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBidXR0b25DYWxsYmFjayhlOiBKUXVlcnkuQ2xpY2tFdmVudCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMud2FudHNUb1JlZGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgICBpZih0aGlzLm1vZGFsRGlzcGxheWVkKSB7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VwZXIucmVkaXNwbGF5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheU5leHQoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLndhbnRzVG9SZWRpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmKHRoaXMubW9kYWxEaXNwbGF5ZWQpIHtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZ1wiKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdXBlci5kaXNwbGF5TmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKCcjcXVlc3Rpb24tZGlhbG9nJykucmVtb3ZlRGF0YSgpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMudGl0bGUgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLmh0bWwodGhpcy50aXRsZS5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAgICAgaWYodGhpcy50ZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHlcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS5odG1sKHRoaXMudGV4dC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBHZW5lcmF0ZSB0aGUgYnV0dG9uICovXG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWZvb3RlclwiKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXJcIikuYXBwZW5kKCQoXCI8YnV0dG9uPjwvYnV0dG9uPlwiKS5hZGRDbGFzcyhcImJ0biBidG4tcHJpbWFyeVwiKS5hdHRyKFwidHlwZVwiLCBcImJ1dHRvblwiKSk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5idXR0b25UZXh0ICE9IG51bGwgJiYgdGhpcy5idXR0b25UZXh0LnN0cmluZ192YWwoKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5jbG9zZVwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXJcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyIGJ1dHRvblwiKS50ZXh0KHRoaXMuYnV0dG9uVGV4dC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5jbG9zZVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXJcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ0NyZWF0ZWQoKTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyIGJ1dHRvblwiKS5vZmYoXCJjbGlja1wiKTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyIGJ1dHRvblwiKS5vbihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uQ2FsbGJhY2soZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoIHsgYmFja2Ryb3A6IFwic3RhdGljXCIgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RhbERpc3BsYXllZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikub25lKFwic2hvd24uYnMubW9kYWxcIiwgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZ1wiKS5vbmUoXCJoaWRkZW4uYnMubW9kYWxcIiwgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RhbERpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2Rpc3Bvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMud2FudHNUb1JlZGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgRGVsYXkgZXh0ZW5kcyBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHRpbWU6IG51bWJlcikge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgICAgICAgICAgfSwgdGhpcy50aW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgTGV2ZWxDaG9pY2UgZXh0ZW5kcyBJbmZvQm94IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGxldmVsTWFya3VwczogKEdhbWVTdHJpbmcpW10pIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ2hvb3NlIGEgbGV2ZWxcIiwgXCJcIiwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS50ZXh0KFwiXCIpO1xuICAgICAgICAgICAgbGV0ICRjb250YWluZXIgPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKFwibGV2ZWwtYnV0dG9uc1wiKTtcbiAgICAgICAgICAgIHRoaXMubGV2ZWxNYXJrdXBzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0ICRidXR0b24gPSAkKFwiPGJ1dHRvbj48L2J1dHRvbj5cIik7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5odG1sKGVsZW1lbnQuc3RyaW5nX3ZhbCgpKTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmRhdGEoXCJsZXZlbC1pZFwiLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEdhbWVUb29scy5jdXJyZW50TGV2ZWwgPSAkYnV0dG9uLmRhdGEoXCJsZXZlbC1pZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmFwcGVuZCgkYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHlcIikuYXBwZW5kKCRjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JbnQobWluIDogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xuICAgICAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGxldCB2YWwgPSBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBwbGF5QXVkaW9JZlN1cHBvcnRlZChhdWRpb0ZpbGU6IEdhbWVTdHJpbmcsIGNiPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBpZighY2IpXG4gICAgICAgICAgICBjYiA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgIGlmKE1vZGVybml6ci5hdWRpbykge1xuICAgICAgICAgICAgdmFyIGF1ZGlvID0gbmV3IEF1ZGlvKGF1ZGlvRmlsZS5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgYXVkaW8ub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwiZW5kZWRcIiwgY2IpO1xuICAgICAgICAgICAgYXVkaW8ucGxheSgpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGNiKCk7XG4gICAgfVxuICAgIFxuICAgIGV4cG9ydCBjbGFzcyBMYWJlbCBleHRlbmRzIEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IEdhbWVTdHJpbmcpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIExvb3BJbmZvIHtcbiAgICAgICAgaW5kZXg6IG51bWJlciB8IHN0cmluZztcbiAgICAgICAgcmVsYXRpdmU/OiBib29sZWFuO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgTG9vcCBleHRlbmRzIEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgXG4gICAgICAgIHByaXZhdGUgbnVtTG9vcHMgPSAwO1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbG9vcEluZm86IExvb3BJbmZvLCBwdWJsaWMgdGltZXMgPSAtMSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLmxvb3BJbmZvLmluZGV4ID09IFwibnVtYmVyXCIgJiYgdGhpcy5sb29wSW5mby5pbmRleCA8IDApXG4gICAgICAgICAgICAgICAgdGhpcy5sb29wSW5mby5yZWxhdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMubG9vcEluZm8ucmVsYXRpdmUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aGlzLmxvb3BJbmZvLnJlbGF0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvKiBSZXN0b3JlIGEgcHJldmlvdXMgbG9vcCAqL1xuICAgICAgICBhZGRMb29wKCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5udW1Mb29wcy0tO1xuICAgICAgICAgICAgaWYodGhpcy5udW1Mb29wcyA8IC0xKVxuICAgICAgICAgICAgICAgIHRoaXMubnVtTG9vcHMgPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBnZXROdW1UaW1lc0xvb3BlZCgpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtTG9vcHM7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmKHRoaXMudGltZXMgPCAwIHx8IHRoaXMubnVtTG9vcHMgPCB0aGlzLnRpbWVzKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHRoaXMubG9vcEluZm8uaW5kZXggPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmxvb3BJbmZvLnJlbGF0aXZlICYmIHRoaXMubXlJbmRleCgpID09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJOb3QgaW4gZ2FtZUNvbnRlbnRzIGFycmF5LCBjYW5ub3QgdXNlIHJlbGF0aXZlIGJyYW5jaFwiO1xuICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5sb29wSW5mby5yZWxhdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggPSB0aGlzLmxvb3BJbmZvLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50c0luZGV4ICs9IHRoaXMubG9vcEluZm8uaW5kZXg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhYmVscyA9IEdhbWVUb29scy5nYW1lQ29udGVudHMuZmlsdGVyKGUgPT4gZSBpbnN0YW5jZW9mIExhYmVsKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZUxhYmVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzLnNvbWUoZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSAoZSBhcyBMYWJlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihsYWJlbC5uYW1lID09IHRoaXMubG9vcEluZm8uaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVMYWJlbCA9IGxhYmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhlTGFiZWwgPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiVW5kZWZpbmVkIGxhYmVsOiBcIiArIHRoaXMubG9vcEluZm8uaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggPSB0aGVMYWJlbC5teUluZGV4KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggLT0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLm51bUxvb3BzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRpbWVzIDwgMClcbiAgICAgICAgICAgICAgICB0aGlzLm51bUxvb3BzID0gMDtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMubnVtTG9vcHMgPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbnN0cnVjdExvb3AobG9vcEluZm86IExvb3BJbmZvLCB0aW1lcyA9IC0xKSB7XG4gICAgICAgIHJldHVybiBuZXcgTG9vcChsb29wSW5mbywgdGltZXMpO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgU3lzdGVtUmVzZXQgZXh0ZW5kcyBHYW1lVG9vbHMuRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICBHYW1lVG9vbHMucmVzZXRTeXN0ZW0oKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gcmVzZXRTeXN0ZW0oKTogdm9pZCB7XG4gICAgICAgIGdhbWVDb250ZW50cy5mb3JFYWNoKGRpc3BsYXllZEl0ZW0gPT4ge1xuICAgICAgICAgICAgZGlzcGxheWVkSXRlbS5yZXNldCgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIGlmKGdhbWVDb250ZW50c1tjb250ZW50c0luZGV4XS5pc0Rpc3BsYXlpbmcoKSkge1xuICAgICAgICAgICAgZ2FtZUNvbnRlbnRzW2NvbnRlbnRzSW5kZXhdLnVuZGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRlbnRzSW5kZXggPSAwO1xuICAgICAgICBnYW1lQ29udGVudHNbY29udGVudHNJbmRleF0uZGlzcGxheSgpO1xuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIERyYWdUYXJnZXRzUXVlc3Rpb25JdGVtIHtcbiAgICAgICAgdGFyZ2V0OiBHYW1lU3RyaW5nO1xuICAgICAgICBuYW1lOiBHYW1lU3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbmNlbFRvb2x0aXBUaW1lb3V0KCR0YXJnZXQ6IEpRdWVyeSk6IHZvaWQge1xuICAgICAgICB2YXIgdGltZW91dCA9ICR0YXJnZXQuZGF0YShcInRvb2x0aXAtdGltZW91dFwiKTtcbiAgICAgICAgaWYodGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgJHRhcmdldC5yZW1vdmVEYXRhKFwidG9vbHRpcC10aW1lb3V0XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBIU0xUb0hleChoLHMsbCkge1xuICAgICAgICBzIC89IDEwMDtcbiAgICAgICAgbCAvPSAxMDA7XG4gICAgICBcbiAgICAgICAgbGV0IGMgPSAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpICogcyxcbiAgICAgICAgICAgIHggPSBjICogKDEgLSBNYXRoLmFicygoaCAvIDYwKSAlIDIgLSAxKSksXG4gICAgICAgICAgICBtID0gbCAtIGMvMixcbiAgICAgICAgICAgIHI6IHN0cmluZyB8IG51bWJlciA9IDAsXG4gICAgICAgICAgICBnOiBzdHJpbmcgfCBudW1iZXIgPSAwLFxuICAgICAgICAgICAgYjogc3RyaW5nIHwgbnVtYmVyID0gMDtcbiAgICAgIFxuICAgICAgICBpZiAoMCA8PSBoICYmIGggPCA2MCkge1xuICAgICAgICAgIHIgPSBjOyBnID0geDsgYiA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoNjAgPD0gaCAmJiBoIDwgMTIwKSB7XG4gICAgICAgICAgciA9IHg7IGcgPSBjOyBiID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICgxMjAgPD0gaCAmJiBoIDwgMTgwKSB7XG4gICAgICAgICAgciA9IDA7IGcgPSBjOyBiID0geDtcbiAgICAgICAgfSBlbHNlIGlmICgxODAgPD0gaCAmJiBoIDwgMjQwKSB7XG4gICAgICAgICAgciA9IDA7IGcgPSB4OyBiID0gYztcbiAgICAgICAgfSBlbHNlIGlmICgyNDAgPD0gaCAmJiBoIDwgMzAwKSB7XG4gICAgICAgICAgciA9IHg7IGcgPSAwOyBiID0gYztcbiAgICAgICAgfSBlbHNlIGlmICgzMDAgPD0gaCAmJiBoIDwgMzYwKSB7XG4gICAgICAgICAgciA9IGM7IGcgPSAwOyBiID0geDtcbiAgICAgICAgfVxuICAgICAgICAvLyBIYXZpbmcgb2J0YWluZWQgUkdCLCBjb252ZXJ0IGNoYW5uZWxzIHRvIGhleFxuICAgICAgICByID0gTWF0aC5yb3VuZCgociArIG0pICogMjU1KS50b1N0cmluZygxNik7XG4gICAgICAgIGcgPSBNYXRoLnJvdW5kKChnICsgbSkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgYiA9IE1hdGgucm91bmQoKGIgKyBtKSAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgICAgXG4gICAgICAgIC8vIFByZXBlbmQgMHMsIGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAoci5sZW5ndGggPT0gMSlcbiAgICAgICAgICByID0gXCIwXCIgKyByO1xuICAgICAgICBpZiAoZy5sZW5ndGggPT0gMSlcbiAgICAgICAgICBnID0gXCIwXCIgKyBnO1xuICAgICAgICBpZiAoYi5sZW5ndGggPT0gMSlcbiAgICAgICAgICBiID0gXCIwXCIgKyBiO1xuICAgICAgXG4gICAgICAgIHJldHVybiBcIiNcIiArIHIgKyBnICsgYjtcbiAgICB9XG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyYXN0WUlRKGhleGNvbG9yKXtcbiAgICAgICAgaGV4Y29sb3IgPSBoZXhjb2xvci5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcbiAgICAgICAgdmFyIHIgPSBwYXJzZUludChoZXhjb2xvci5zdWJzdHIoMCwyKSwxNik7XG4gICAgICAgIHZhciBnID0gcGFyc2VJbnQoaGV4Y29sb3Iuc3Vic3RyKDIsMiksMTYpO1xuICAgICAgICB2YXIgYiA9IHBhcnNlSW50KGhleGNvbG9yLnN1YnN0cig0LDIpLDE2KTtcbiAgICAgICAgdmFyIHlpcSA9ICgocioyOTkpKyhnKjU4NykrKGIqMTE0KSkvMTAwMDtcbiAgICAgICAgcmV0dXJuICh5aXEgPj0gMTI4KSA/ICdibGFjaycgOiAnd2hpdGUnO1xuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRHJhZ1RhcmdldHNRdWVzdGlvbiBleHRlbmRzIEluZm9Cb3gge1xuICAgICAgICBzdGF0aWMgYWx3YXlzQmVSaWdodCA9IGZhbHNlO1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdGl0bGU6IEdhbWVTdHJpbmcsIHByb3RlY3RlZCBpdGVtczogRHJhZ1RhcmdldHNRdWVzdGlvbkl0ZW1bXSwgcHJvdGVjdGVkIHNodWZmbGVUYXJnZXRzID0gZmFsc2UsIHByb3RlY3RlZCBzaHVmZmxlT3B0aW9ucyA9IGZhbHNlKSB7XG4gICAgICAgICAgICBzdXBlcih0aXRsZSwgXCJcIiwgXCJDaGVja1wiKTtcbiAgICAgICAgfVxuICAgICAgICBidXR0b25DYWxsYmFjayhlOiBKUXVlcnkuQ2xpY2tFdmVudCk6IHZvaWQge1xuICAgICAgICAgICAgdmFyICRpdGVtc0RpdiA9ICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5IC5pdGVtcy1kaXZcIik7XG4gICAgICAgICAgICB2YXIgJHRhcmdldHNEaXYgPSAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHkgLnRhcmdldHMtZGl2XCIpO1xuICAgICAgICAgICAgaWYoIURyYWdUYXJnZXRzUXVlc3Rpb24uYWx3YXlzQmVSaWdodCAmJiAkaXRlbXNEaXYuY2hpbGRyZW4oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3RSZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyICRkcmFnSXRlbXMgPSAkdGFyZ2V0c0Rpdi5maW5kKFwiLmRyYWctaXRlbVwiKTtcbiAgICAgICAgICAgICAgICBHYW1lVG9vbHMubGFzdFJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYoIURyYWdUYXJnZXRzUXVlc3Rpb24uYWx3YXlzQmVSaWdodClcbiAgICAgICAgICAgICAgICAgICAgJGRyYWdJdGVtcy5lYWNoKChpbmRleCwgZWxlbWVudCk6IGZhbHNlIHwgdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighKCQoZWxlbWVudCkuZGF0YShcInRhcmdldFwiKSBhcyBKUXVlcnk8SFRNTEVsZW1lbnQ+KS5pcygkKGVsZW1lbnQpLnBhcmVudCgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1cGVyLmJ1dHRvbkNhbGxiYWNrKGUpO1xuICAgICAgICB9XG4gICAgICAgIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICB2YXIgJHRhcmdldHNEaXYgPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAgICAgICB2YXIgJGl0ZW1zRGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgICAgICAgdmFyICRib3RoRGl2cyA9ICAkdGFyZ2V0c0Rpdi5hZGQoJGl0ZW1zRGl2KTtcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyRGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpLmFwcGVuZCgkYm90aERpdnMpO1xuICAgICAgICAgICAgJGNvbnRhaW5lckRpdi5jc3Moe1xuICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiBcImZsZXhcIixcbiAgICAgICAgICAgICAgICBcIndpZHRoXCI6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiMTAwJVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLmFwcGVuZCgkY29udGFpbmVyRGl2KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJGJvdGhEaXZzLmFkZENsYXNzKFwiZHJhZ3RhcmdldHMtZGl2XCIpO1xuICAgICAgICAgICAgJHRhcmdldHNEaXYuYWRkQ2xhc3MoXCJ0YXJnZXRzLWRpdlwiKTtcbiAgICAgICAgICAgICRpdGVtc0Rpdi5hZGRDbGFzcyhcIml0ZW1zLWRpdlwiKTtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBpdGVtLnRhcmdldDtcbiAgICAgICAgICAgICAgICBsZXQgJHNwYW4gPSAkKFwiPHNwYW4+PC9zcGFuPlwiKS5odG1sKHRhcmdldC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIGxldCAkZGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpLmFwcGVuZCgkc3BhbikuYWRkQ2xhc3MoXCJ0YXJnZXRcIik7XG4gICAgICAgICAgICAgICAgJGRpdi5kYXRhKFwibXktdGV4dFwiLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgICR0YXJnZXRzRGl2LmFwcGVuZCgkZGl2KTtcbiAgICAgICAgICAgICAgICAkZGl2LmFwcGVuZCgkKFwiPGk+PC9pPlwiKS5hZGRDbGFzcyhcImZhcyBmYS1xdWVzdGlvbi1jaXJjbGVcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gJCh0aGlzKS5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsVG9vbHRpcFRpbWVvdXQoJHRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICR0YXJnZXQudG9vbHRpcCgnc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LmRhdGEoXCJ0b29sdGlwLXRpbWVvdXRcIiwgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LnRvb2x0aXAoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMzAwMCkpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAkZGl2LmNoaWxkcmVuKFwiaVwiKS5oaWRlKCk7XG5cblxuICAgICAgICAgICAgICAgIGNvbnN0ICR0YXJnZXREaXYgPSAkZGl2O1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tDb2xvciA9IEhTTFRvSGV4KGdldFJhbmRvbUludCgwLCAzNjApLCAxMDAsIDkwKTtcbiAgICAgICAgICAgICAgICAkZGl2ID0gJChcIjxkaXY+PC9kaXY+XCIpLmFkZENsYXNzKFwiZHJhZy1pdGVtXCIpLmRhdGEoXCJ0YXJnZXRcIiwgJHRhcmdldERpdikuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IGJhY2tDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBnZXRDb250cmFzdFlJUShiYWNrQ29sb3IpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGRpdi5hcHBlbmQoJChcIjxkaXY+PC9kaXY+XCIpLmNzcyhcIm1hcmdpblwiLCBcImF1dG9cIikuaHRtbChpdGVtLm5hbWUuc3RyaW5nX3ZhbCgpKSk7XG4gICAgICAgICAgICAgICAgJGl0ZW1zRGl2LmFwcGVuZCgkZGl2KTtcbiAgICAgICAgICAgICAgICAkdGFyZ2V0RGl2LmF0dHIoXCJ0aXRsZVwiLCAkdGFyZ2V0RGl2LmRhdGEoXCJteS10ZXh0XCIpKTtcbiAgICAgICAgICAgICAgICAkdGFyZ2V0RGl2LnRvb2x0aXAoe1xuICAgICAgICAgICAgICAgICAgICBodG1sOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJHRhcmdldERpdi50b29sdGlwKCdkaXNhYmxlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmKHRoaXMuc2h1ZmZsZVRhcmdldHMpXG4gICAgICAgICAgICAgICAgKCR0YXJnZXRzRGl2IGFzIGFueSkucmFuZG9taXplKCk7XG4gICAgICAgICAgICBpZih0aGlzLnNodWZmbGVPcHRpb25zKVxuICAgICAgICAgICAgICAgICgkaXRlbXNEaXYgYXMgYW55KS5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBndEJlZm9yZURyb3BGdW5jdGlvbiA9IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImd0IGJlZm9yZSBkcm9wXCIpO1xuICAgICAgICAgICAgICAgIGlmKCQodGhpcykuaGFzQ2xhc3MoXCJ0YXJnZXRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b29sdGlwKCdlbmFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbihcImlcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKFwic3BhblwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGRyb3BGdW5jdGlvbiA9IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKFwiZ3QuYmVmb3JlX2Ryb3BcIik7XG4gICAgICAgICAgICAgICAgbGV0ICRkcmFnZ2FibGUgPSAkKGRvY3VtZW50KS5maW5kKFwiLnVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiKTtcbiAgICAgICAgICAgICAgICBpZighJGRyYWdnYWJsZS5nZXQoMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRyYWdnYWJsZSA9ICQodGhpcykuY2hpbGRyZW4oXCIuZHJhZy1pdGVtXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZighJGRyYWdnYWJsZS5nZXQoMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiQ2FuJ3QgZmluZCBkcmFnZ2FibGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkZHJhZ2dhYmxlWzBdKTtcbiAgICAgICAgICAgICAgICAkZHJhZ2dhYmxlLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIFwidG9wXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibGVmdFwiOiBcIlwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGRyYWdnYWJsZS5kZXRhY2goKS5hcHBlbmRUbygkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgICAgICAgICBpZigkKHRoaXMpLmlzKCRpdGVtc0RpdikpXG4gICAgICAgICAgICAgICAgICAgICRkcmFnZ2FibGUuY3NzKHsgXCJwb3NpdGlvblwiOiBcInJlbGF0aXZlXCJ9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgb3V0RnVuY3Rpb24gPSBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgaWYoJCh0aGlzKS5oYXNDbGFzcyhcInRhcmdldFwiKSAmJiAkKHRoaXMpLmNoaWxkcmVuKFwiLmRyYWctaXRlbVwiKS5oYXNDbGFzcyhcInVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmNoaWxkcmVuKCkuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbihcImlcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKFwic3BhblwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykudG9vbHRpcCgnZGlzYWJsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgZHJhZ0luZm86IEpRdWVyeVVJLkRyYWdnYWJsZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgY29udGFpbm1lbnQ6ICQoJ2JvZHknKSxcbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICAkKHVpLmhlbHBlcikuY3NzKHsgXCJ0cmFuc2Zvcm1cIjogXCJub25lXCJ9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXZlcnQ6IGZ1bmN0aW9uIChkcm9wcGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWRyb3BwYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXZlcnRpbmchXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS50cmlnZ2VyKFwiZ3QuYmVmb3JlX2Ryb3BcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkcmFnOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCQodWkuaGVscGVyKS5wYXJlbnQoKS5oYXNDbGFzcyhcInRhcmdldFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh1aS5oZWxwZXIpLnBhcmVudCgpLnRvb2x0aXAoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsVG9vbHRpcFRpbWVvdXQoJCh1aS5oZWxwZXIpLnBhcmVudCgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICAkKHVpLmhlbHBlcikuY3NzKHsgXCJ0cmFuc2Zvcm1cIjogXCJcIn0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICR0YXJnZXRzRGl2LmNoaWxkcmVuKFwiZGl2XCIpLmRyb3BwYWJsZSgpLm9uKFwiZHJvcFwiLCBkcm9wRnVuY3Rpb24pLm9uKFwiZHJvcG91dFwiLCBvdXRGdW5jdGlvbikub24oXCJndC5iZWZvcmVfZHJvcFwiLCBndEJlZm9yZURyb3BGdW5jdGlvbik7XG4gICAgICAgICAgICAkaXRlbXNEaXYuZHJvcHBhYmxlKCkub24oXCJkcm9wXCIsIGRyb3BGdW5jdGlvbikub24oXCJkcm9wb3V0XCIsIG91dEZ1bmN0aW9uKTtcbiAgICAgICAgICAgICRpdGVtc0Rpdi5jaGlsZHJlbihcImRpdlwiKS5kcmFnZ2FibGUoZHJhZ0luZm8pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBGdW5jdGlvbkRpc3BsYXllZEl0ZW0gZXh0ZW5kcyBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBmdW5jOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG4gICAgICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLmZ1bmMoKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgQ29uZGl0aW9uIGV4dGVuZHMgRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0cnVlU3RhdGVtZW50OiBEaXNwbGF5ZWRJdGVtLCBwdWJsaWMgZmFsc2VTdGF0ZW1lbnQ6IERpc3BsYXllZEl0ZW0sIHB1YmxpYyBjdXN0b21Db25kaXRpb24/OiAoKSA9PiBib29sZWFuKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgaWYodGhpcy5jdXN0b21Db25kaXRpb24gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbUNvbmRpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gR2FtZVRvb2xzLmxhc3RSZXN1bHQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodGhpcy5jdXN0b21Db25kaXRpb24oKSlcbiAgICAgICAgICAgICAgICB0aGlzLnRydWVTdGF0ZW1lbnQuZGlzcGxheSgpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuZmFsc2VTdGF0ZW1lbnQuZGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodGhpcy50cnVlU3RhdGVtZW50KVxuICAgICAgICAgICAgICAgIHRoaXMudHJ1ZVN0YXRlbWVudC5yZXNldCgpO1xuICAgICAgICAgICAgaWYodGhpcy5mYWxzZVN0YXRlbWVudClcbiAgICAgICAgICAgICAgICB0aGlzLmZhbHNlU3RhdGVtZW50LnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIEludGVyYWN0aXZlU1ZHIGV4dGVuZHMgSW5mb0JveCB7XG4gICAgICAgIGNvbnN0cnVjdG9yICh0aXRsZTogR2FtZVN0cmluZywgcHVibGljIGltZ1NyYzogR2FtZVN0cmluZywgcHVibGljIGludGVyYWN0aXZlQ29tcG9uZW50cz86IEdhbWVTdHJpbmdbXSkge1xuICAgICAgICAgICAgc3VwZXIodGl0bGUsIFwiXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRpYyBzY3JvbGxIYW5kbGVyKCk6IHZvaWQge1xuICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQgPSAoJChcIi5pbnRlcmFjdGl2ZS1zdmcgaW1nXCIpLndpZHRoKCkgLSAkKFwiLmludGVyYWN0aXZlLXN2Z1wiKS53aWR0aCgpKSAvIDI7XG4gICAgICAgICAgICAkKFwiLmludGVyYWN0aXZlLXN2Z1wiKS5zY3JvbGxMZWZ0KHNjcm9sbExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIGludGVyYWN0aXZlQ29tcG9uZW50Q2xpY2tlZCgkY29tcG9uZW50OiBKUXVlcnk8U1ZHRWxlbWVudD4pOiB2b2lkIHtcbiAgICAgICAgICAgIEdhbWVUb29scy5sYXN0RGF0YSA9ICRjb21wb25lbnQ7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlOZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlhbG9nQ3JlYXRlZCgpOiB2b2lkIHtcbiAgICAgICAgICAgIGxldCAkc3ZnQ29udGFpbmVyID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgICAgICAgbGV0ICRpbWcgPSAkKFwiPGltZz48L2ltZz5cIik7XG4gICAgICAgICAgICAkc3ZnQ29udGFpbmVyLmFkZENsYXNzKFwiaW50ZXJhY3RpdmUtc3ZnXCIpO1xuICAgICAgICAgICAgJHN2Z0NvbnRhaW5lci5sb2FkKHRoaXMuaW1nU3JjLnN0cmluZ192YWwoKSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaW50ZXJhY3RpdmVDb21wb25lbnRzKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlQ29tcG9uZW50cy5mb3JFYWNoKChzZWxlY3RvciwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdmcgPSAkc3ZnQ29udGFpbmVyLmZpbmQoXCJzdmdcIikuZ2V0KDApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudHMgPSBzdmcucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvci5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKFwiaW50ZXJhY3RpdmUtY29tcG9uZW50XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZUNvbXBvbmVudENsaWNrZWQoKCQoZS50YXJnZXQpIGFzIEpRdWVyeTxFbGVtZW50PikgYXMgSlF1ZXJ5PFNWR0VsZW1lbnQ+KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS5hcHBlbmQoJHN2Z0NvbnRhaW5lcik7XG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwicmVzaXplXCIsIEludGVyYWN0aXZlU1ZHLnNjcm9sbEhhbmRsZXIpO1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIEludGVyYWN0aXZlU1ZHLnNjcm9sbEhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgICAgIHVuZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHN1cGVyLnVuZGlzcGxheSgpO1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInJlc2l6ZVwiLCBJbnRlcmFjdGl2ZVNWRy5zY3JvbGxIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgY2xhc3MgRmluZGVyIHtcbiAgICAgICAgcHVibGljIGl0ZW1zRm91bmQ6IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSBpdGVtSW5kZXhlczogYW55W10gPSBbXTtcbiAgICAgICAgcHVibGljICRjb21wb25lbnRGb3VuZDogSlF1ZXJ5O1xuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFyZW50OiBEaXNwbGF5ZWRJdGVtLCBwdWJsaWMgbnVtSXRlbXM6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5pdGVtSW5kZXhlcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5pdGVtc0ZvdW5kID0gMDtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaXRsZSgpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmKHRoaXMuaXRlbXNGb3VuZCA+IDApXG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLnRleHQoXCJZb3UgaGF2ZSBmb3VuZCBcIiArIHRoaXMuaXRlbXNGb3VuZCArIFwiIG9mIFwiICsgdGhpcy5udW1JdGVtcyArIFwiIGl0ZW1zLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtRm91bmQoJGNvbXBvbmVudDogSlF1ZXJ5PGFueT4pOiB2b2lkIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYodGhpcy5pdGVtSW5kZXhlcy5pbmRleE9mKCRjb21wb25lbnQuZGF0YShcImluZGV4XCIpKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNGb3VuZCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbUluZGV4ZXMucHVzaCgkY29tcG9uZW50LmRhdGEoXCJpbmRleFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiRjb21wb25lbnRGb3VuZCA9ICRjb21wb25lbnQ7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5kaXNwbGF5TmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmlzaGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXNGb3VuZCA9PSB0aGlzLm51bUl0ZW1zO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBJbnRlcmFjdGl2ZVNWR0ZpbmRlciBleHRlbmRzIEludGVyYWN0aXZlU1ZHIHtcbiAgICAgICAgZmluZGVyOiBGaW5kZXI7XG4gICAgICAgIGNvbnN0cnVjdG9yKHRpdGxlOiBHYW1lU3RyaW5nLCBwdWJsaWMgaW1nU3JjOiBHYW1lU3RyaW5nLCBpbnRlcmFjdGl2ZUNvbXBvbmVudHM6IChHYW1lU3RyaW5nKVtdLCBwdWJsaWMgbnVtSXRlbXM6IG51bWJlcikge1xuICAgICAgICAgICAgc3VwZXIodGl0bGUsIGltZ1NyYywgaW50ZXJhY3RpdmVDb21wb25lbnRzKTtcbiAgICAgICAgICAgIHRoaXMuZmluZGVyID0gbmV3IEZpbmRlcih0aGlzLCBudW1JdGVtcyk7XG4gICAgICAgIH1cbiAgICAgICAgcHVibGljIGl0ZW1zRm91bmQgPSAwO1xuICAgICAgICBpbnRlcmFjdGl2ZUNvbXBvbmVudENsaWNrZWQoJGNvbXBvbmVudDogSlF1ZXJ5PFNWR0VsZW1lbnQ+KTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLmZpbmRlci5pdGVtRm91bmQoJGNvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgICAgICBpZih0aGlzLmZpbmRlciAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuZmluZGVyLnJlc2V0KCk7XG4gICAgICAgICAgICBzdXBlci5yZXNldCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b25GaW5kZXIgZXh0ZW5kcyBJbmZvQm94IHtcbiAgICAgICAgZmluZGVyOiBGaW5kZXI7XG4gICAgICAgIGRpZERpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgY29uc3RydWN0b3IodGl0bGU6IEdhbWVTdHJpbmcsIHB1YmxpYyBpbnN0cnVjdGlvbnM6IEdhbWVTdHJpbmcsIHB1YmxpYyBidXR0b25zOiAoR2FtZVN0cmluZylbXSkge1xuICAgICAgICAgICAgc3VwZXIodGl0bGUsIGluc3RydWN0aW9ucywgbnVsbCk7XG4gICAgICAgICAgICB0aGlzLmZpbmRlciA9IG5ldyBGaW5kZXIodGhpcywgYnV0dG9ucy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJlc2V0KCk6IHZvaWQge1xuICAgICAgICAgICAgaWYodGhpcy5maW5kZXIgIT0gbnVsbClcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmRlci5yZXNldCgpO1xuICAgICAgICAgICAgc3VwZXIucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5TmV4dCgpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZGlkRGlzcGxheSlcbiAgICAgICAgICAgICAgICBHYW1lVG9vbHMubGFzdFJlc3VsdCA9IGZhbHNlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gdGhpcy5maW5kZXIuZmluaXNoZWQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZmluZGVyLiRjb21wb25lbnRGb3VuZC5nZXQoMCkpO1xuICAgICAgICAgICAgR2FtZVRvb2xzLmxhc3REYXRhID0gdGhpcy5maW5kZXIuJGNvbXBvbmVudEZvdW5kLmRhdGEoXCJpbmRleFwiKTtcbiAgICAgICAgICAgIHN1cGVyLmRpc3BsYXlOZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIGlmKHRoaXMuZmluZGVyLmZpbmlzaGVkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpZERpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlOZXh0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlkRGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3VwZXIuZGlzcGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICB2YXIgJGJvZHkgPSAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKTtcbiAgICAgICAgICAgICRib2R5Lmh0bWwoXCJcIik7XG4gICAgICAgICAgICAkYm9keS5zaG93KCk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaW5zdHJ1Y3Rpb25zICE9IG51bGwpXG4gICAgICAgICAgICAgICAgJGJvZHkuYXBwZW5kKCQoXCI8c3Bhbj48L3NwYW4+XCIpLmh0bWwodGhpcy5pbnN0cnVjdGlvbnMuc3RyaW5nX3ZhbCgpKSk7XG4gICAgICAgICAgICB0aGlzLmZpbmRlci5zZXRUaXRsZSgpO1xuICAgICAgICAgICAgdmFyICRmaW5kZXJCdXR0b25zID0gJChcIjxkaXY+PC9kaXY+XCIpLmFkZENsYXNzKFwiZmluZGVyLWJ1dHRvbnNcIikuYXBwZW5kVG8oJGJvZHkpO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gIFxuICAgICAgICAgICAgICAgIHZhciAkYnV0dG9uID0gJChcIjxidXR0b24+PC9idXR0b24+XCIpLmh0bWwoZWxlbWVudC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICRidXR0b24uZGF0YShcImluZGV4XCIsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRmaW5kZXJCdXR0b25zLmNoaWxkcmVuKFwiYnV0dG9uXCIpLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kZXIuaXRlbUZvdW5kKCQoZS50YXJnZXQpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkZmluZGVyQnV0dG9ucy5hcHBlbmQoJGJ1dHRvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gaW1hZ2VBbmRUZXh0KGltZ1NyYzogR2FtZVN0cmluZywgdGV4dDogR2FtZVN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcIjxpbWcgc3JjPSdcIiArIGltZ1NyYyArIFwiJz48L2ltZz5cIiArIHRleHQ7XG4gICAgfVxuICAgIGV4cG9ydCBjbGFzcyBUcnVlRmFsc2VRdWVzdGlvbiBleHRlbmRzIEluZm9Cb3gge1xuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogR2FtZVN0cmluZywgcHJvdGVjdGVkIGNvcnJlY3RBbnN3ZXI/OiBib29sZWFuKSB7XG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbiwgbnVsbCwgXCJUcnVlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGJ1dHRvbkNhbGxiYWNrKGU6IEpRdWVyeS5DbGlja0V2ZW50KTogdm9pZCB7XG4gICAgICAgICAgICBjb25zdCBpc1RydWUgPSAkKGUudGFyZ2V0KS50ZXh0KCkgPT0gXCJUcnVlXCI7XG4gICAgICAgICAgICBpZih0aGlzLmNvcnJlY3RBbnN3ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gaXNUcnVlID09IHRoaXMuY29ycmVjdEFuc3dlcjtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gaXNUcnVlO1xuICAgICAgICAgICBcbiAgICAgICAgICAgIHN1cGVyLmJ1dHRvbkNhbGxiYWNrKGUpO1xuICAgICAgICB9XG4gICAgICAgIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG4gICAgICAgICAgICB2YXIgJGZvb3RlciA9ICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXJcIik7XG4gICAgICAgICAgICAkZm9vdGVyLmFwcGVuZCgkKFwiPGJ1dHRvbj48L2J1dHRvbj5cIikuYWRkQ2xhc3MoXCJidG4gYnRuLXNlY29uZGFyeVwiKS50ZXh0KFwiRmFsc2VcIikuY2xpY2sodGhpcy5idXR0b25DYWxsYmFjaykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUXVlc3Rpb25PcHRpb24ge1xuICAgICAgICBodG1sOiBHYW1lU3RyaW5nO1xuICAgICAgICBjb3JyZWN0PzogYm9vbGVhbjtcbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIE11bHRpcGxlQ2hvaWNlUXVlc3Rpb24gZXh0ZW5kcyBJbmZvQm94IHtcbiAgICAgICAgY29uc3RydWN0b3IocXVlc3Rpb246IEdhbWVTdHJpbmcsIHByb3RlY3RlZCBjaG9pY2VzOiBRdWVzdGlvbk9wdGlvbltdLCBwcm90ZWN0ZWQgc2hvdWxkUmVEaXNwbGF5ID0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN1cGVyKFwiQ2hvb3NlIG9uZSBvZiB0aGUgY2hvaWNlcy5cIiwgcXVlc3Rpb24sIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGFuc3dlcmVkKCRidXR0b246IEpRdWVyeTxIVE1MRWxlbWVudD4pOiB2b2lkIHtcbiAgICAgICAgICAgIGxldCBvcHRpb246IFF1ZXN0aW9uT3B0aW9uID0gJGJ1dHRvbi5kYXRhKFwicXVlc3Rpb25PcHRpb25cIik7XG4gICAgICAgICAgICBpZihvcHRpb24uY29ycmVjdCkge1xuICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlOZXh0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIEdhbWVUb29scy5sYXN0UmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IFwiU29ycnksIHRoYXQgd2Fzbid0IHRoZSBjb3JyZWN0IGFuc3dlci5cIjtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnNob3VsZFJlRGlzcGxheSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkaWFsb2dDcmVhdGVkKCk6IHZvaWQge1xuICAgICAgICAgICAgdmFyICRib2R5ID0gJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHlcIik7XG4gICAgICAgICAgICB2YXIgJGZpbmRlckJ1dHRvbnMgPSAkKFwiPGRpdj48L2Rpdj5cIikuYWRkQ2xhc3MoXCJmaW5kZXItYnV0dG9uc1wiKS5hcHBlbmRUbygkYm9keSk7XG4gICAgICAgICAgICBzaHVmZmxlKHRoaXMuY2hvaWNlcykuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgJGJ1dHRvbiA9ICQoXCI8YnV0dG9uPjwvYnV0dG9uPlwiKS5odG1sKGVsZW1lbnQuaHRtbC5zdHJpbmdfdmFsKCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhY2tDb2xvciA9IEhTTFRvSGV4KGdldFJhbmRvbUludCgwLCAzNjApLCAxMDAsIDkwKTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBiYWNrQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogZ2V0Q29udHJhc3RZSVEoYmFja0NvbG9yKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICRidXR0b24uZGF0YShcImluZGV4XCIsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmRhdGEoXCJxdWVzdGlvbk9wdGlvblwiLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmNsaWNrKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRmaW5kZXJCdXR0b25zLmNoaWxkcmVuKFwiYnV0dG9uXCIpLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJlZCgkYnV0dG9uKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkZmluZGVyQnV0dG9ucy5hcHBlbmQoJGJ1dHRvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgR3JlZWNlSW50ZXJhY3RpdmVNYXAgZXh0ZW5kcyBHYW1lVG9vbHMuSW50ZXJhY3RpdmVTVkcge1xuICAgIGludGVyYWN0aXZlQ29tcG9uZW50Q2xpY2tlZCgkY29tcG9uZW50OiBKUXVlcnk8U1ZHRWxlbWVudD4pOiB2b2lkIHtcbiAgICAgICAgaWYoJGNvbXBvbmVudC5hdHRyKFwiaWRcIikgIT0gXCJFdXJvcGVcIikge1xuICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLnRleHQoXCJOb3BlLCB0aGF0J3MgXCIgKyAkY29tcG9uZW50LmF0dHIoXCJpZFwiKS5yZXBsYWNlKCdfJywgJyAnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZ1wiKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5sZXQgYXRoZW5zOiBzdHJpbmdbXSA9IFtcbiAgICBcIk9ubHkgbWVuIHdlcmUgYWxsb3dlZCB0byB2b3RlIGluIEF0aGVucy4gVm90aW5nIHRvb2sgcGxhY2UgYnkgdXNlIG9mIGEgaGFuZC1jb3VudC4gQmFsbG90cyB3ZXJlbid0IGNvbW1vbmx5IHVzZWQgYmFjayB0aGVuIVwiLFxuICAgIFwiVGhlIEFjcm9wb2xpcyBpcyBhIGhpbGwgaW4gQXRoZW5zIHRoYXQgdGVtcGxlcyBmb3IgdGhlIGdvZHMgYW5kIGdvZGRlc3NlcyB3ZXJlIGJ1aWx0IG9uLlwiLFxuICAgIFwiVGhlIFBhcnRoZW5vbiBpcyBhIHRlbXBsZSB0aGF0IHdhcyBvcmlnaW5hbGx5IGJ1aWx0IHRvIGhvbm9yIHRoZSBnb2RkZXNzIEF0aGVuYS4gVGhvdWdoIGl0IHdhcyBidWlsdCB0aG91c2FuZHMgb2YgeWVhcnMgYWdvLCBpdCBpcyBzdGlsbCBzdGFuZGluZyB0b2RheS5cIixcbiAgICBcIkdpcmxzIGRpZCBub3QgYXR0ZW5kIHNjaG9vbCBpbiBBdGhlbnM7IGluc3RlYWQsIHRoZXkgd2VyZSB0YXVnaHQgYnkgdGhlaXIgbW90aGVycyBob3cgdG8gY29vaywgY2xlYW4sIGFuZCBkbyBvdGhlciBtYXRlcm5hbCBkdXRpZXMuXCIsXG4gICAgXCJCb3lzIGluIEF0aGVucyBzcGVudCAyIHllYXJzIHRyYWluaW5nIHRvIGJlIHNvbGRpZXJzIHdoZW4gdGhleSByZWFjaGVkIDE4LiBUaGV5IGhhZCB0aGUgbGV0dGVyIEEgcGFpbnRlZCBvbiB0aGVpciBzaGllbGQuIEF0aGVuaWFuIGJveXMgaGFkIHRvIGJ1eSB0aGVpciBvd24gd2VhcG9ucy5cIixcbiAgICBcIkF0aGVuaWFuIGJveXMgd2VudCB0byBzY2hvb2wgYXQgdGhlIGFnZSBvZiA3LiBUaGV5IGxlYXJuZWQgcmVhZGluZywgd3JpdGluZywgbXVzaWMsIGFuZCBwb2V0cnkuIEF0IDE4IHRoZXkgbGVmdCB0byBqb2luIHRoZSBtaWxpdGFyeS5cIixcbiAgICBcIkluIEF0aGVucywgcGVvcGxlIGxpdmVkIGluIGhvdXNlcyBidWlsdCBiZWxvdyB0aGUgQWNyb3BvbGlzLlwiLFxuICAgIFwiVGhlIG9saXZlIHRyZWUgd2FzIGJlbGlldmVkIHRvIGhhdmUgYmVlbiBnaXZlbiB0byBBdGhlbnMgYXMgYSBnaWZ0IGJ5IHRoZSBnb2RkZXNzIEF0aGVuYS5cIlxuXTtcbmxldCBzcGFydGE6IHN0cmluZ1tdID0gW1xuICAgIFwiSW4gU3BhcnRhLCBvbGl2ZSB0cmVlcyB3ZXJlIHVzZWQgYXMgYSB3YXkgdG8gdGhhbmsgdGhlIGdvZHMgZm9yIGEgdmljdG9yeS4gQWZ0ZXIgYW4gaW50ZW5zZSBiYXR0bGUgdGhlIFNwYXJ0YW5zIHdvdWxkIGhhbmcgdGhlaXIgd2VhcG9ucyBpbiB0aGUgdHJlZS5cIixcbiAgICBcIldoZW4gYm95cyB3ZXJlIDIwIHllYXJzIG9sZCB0aGV5IGpvaW5lZCB0aGUgU3BhcnRhbiBhcm15LiBUaGV5IGFsd2F5cyB3b3JlIHJlZCBjbG9ha3Mgd2hlbiB0aGV5IHdlbnQgdG8gZmlnaHQsIGFuZCB3ZXJlIGtub3duIGZvciBiZWluZyB0aGUgdG91Z2hlc3Qgd2FycmlvcnMgaW4gR3JlZWNlIVwiLFxuICAgIFwiRXZlbiB0aG91Z2ggZ2lybHMgd2VyZW4ndCBpbiB0aGUgYXJteSwgdGhleSBoYWQgdG8gc3RheSBhY3RpdmUgc28gdGhleSBjb3VsZCBoYXZlIGhlYWx0aHkgYmFiaWVzLCBiZWNhdXNlIFNwYXJ0YW4gYmFiaWVzIGFsd2F5cyBoYWQgdG8gYmUgc3Ryb25nXCIsXG4gICAgXCJTcGFydGFucyBvbmx5IHdhbnRlZCB0aGUgYmVzdCwgc28gd2VhayBTcGFydGFuIGJhYmllcyB3ZXJlIGxlZnQgdG8gZGllLlwiLFxuICAgIFwiQm95cyBpbiBTcGFydGEgZGlkbid0IGdvIHRvIHNjaG9vbC4gQXMgc29vbiBhcyB0aGV5IHR1cm5lZCA3IHRoZXkgc3RhcnRlZCB0cmFpbmluZyBmb3IgdGhlIG1pbGl0YXJ5LiBQcmV0dHkgZGlmZmVyZW50IGZyb20gQXRoZW5zLCBodWg/XCIsXG4gICAgXCJTcGFydGFuIGJveXMgd2VyZSBkZWxpYmVyYXRlbHkga2VwdCBodW5ncnksIHNvIHRoZXkgaGFkIHRvIHJvYW0gYXJvdW5kIHN0ZWFsaW5nIGZvb2QgdG8gc3Vydml2ZS4gVGhpcyB0YXVnaHQgdGhlbSB1c2VmdWwgc2tpbGxzIGZvciBiYXR0bGUuXCJcbl07XG5HYW1lVG9vbHMuZ2FtZUNvbnRlbnRzID0gW1xuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIldlbGNvbWUhXCIsIFwiV2VsY29tZSB0byBHb29kIE9sJyBHcmVlY2UuPHA+PC9wPklmIHlvdSdyZSBwbGF5aW5nIG9uIGEgc21hbGwgZGV2aWNlLCB3ZSByZWNvbW1lbmQgdXNpbmcgbGFuZHNjYXBlIGZvciBzb21lIG9yIGFsbCBvZiB0aGUgcGFydHMgaW4gdGhpcyBnYW1lLlwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkxhYmVsKFwiZHJhZ3F1ZXN0aW9uXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuRHJhZ1RhcmdldHNRdWVzdGlvbihcIkNhbiB5b3UgcHV0IHRoZXNlIGluIG9yZGVyP1wiLCBbXG4gICAgICAgIHsgbmFtZTogXCIxODUyIEIuQy5cIiwgdGFyZ2V0OiBcIlB5cmFtaWRzIGJlZ2luIHRvIGJlIGJ1aWx0XCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjUwMCBCLkMuXCIsIHRhcmdldDogXCJHcmVlayBDbGFzc2ljYWwgQWdlXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjAgQi5DLi9BLkQuXCIsIHRhcmdldDogXCJDaHJpc3QgaXMgYm9yblwiIH0sXG4gICAgICAgIHsgbmFtZTogXCI0MTAgQS5ELlwiLCB0YXJnZXQ6IFwiVGhlIGZhbGwgb2YgUm9tZVwiIH0sXG4gICAgICAgIHsgbmFtZTogXCIxMDY2IEEuRC5cIiwgdGFyZ2V0OiAgXCJUaGUgQmF0dGxlIG9mIEhhc3RpbmdzXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjE5NTIgQS5ELlwiLCB0YXJnZXQ6IFwiUXVlZW4gRWxpemFiZXRoIElJIGNyb3duZWRcIiB9XG4gICAgXSwgZmFsc2UsIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuQ29uZGl0aW9uKG5ldyBHYW1lVG9vbHMuTG9vcCh7IGluZGV4OiBcImRxX2NvcnJlY3RcIiB9KSwgbmV3IEdhbWVUb29scy5Mb29wKHsgaW5kZXg6IFwiZHFfaW5jb3JyZWN0XCIgfSkpLFxuICAgIG5ldyBHYW1lVG9vbHMuTGFiZWwoXCJkcV9jb3JyZWN0XCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIkdyZWF0IGpvYiFcIiwgXCJZb3UgbXVzdCBrbm93IHdoYXQgeW91J3JlIGRvaW5nIVwiLCBcIkNvbnRpbnVlXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuTG9vcCh7IGluZGV4OiBcImZpcnN0LW1hcFwifSksXG4gICAgbmV3IEdhbWVUb29scy5MYWJlbChcImRxX2luY29ycmVjdFwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkluZm9Cb3goXCJXaG9vcHMhXCIsIFwiTG9va3MgbGlrZSBzb21ldGhpbmcgd2VudCB3cm9uZyB0aGVyZS4gR2l2ZSBpdCBhbm90aGVyIHRyeSFcIiwgXCJUcnkgYWdhaW5cIiksXG4gICAgbmV3IEdhbWVUb29scy5Mb29wKHsgaW5kZXg6IFwiZHJhZ3F1ZXN0aW9uXCIgfSksXG4gICAgbmV3IEdhbWVUb29scy5MYWJlbChcImZpcnN0LW1hcFwiKSxcbiAgICBuZXcgR3JlZWNlSW50ZXJhY3RpdmVNYXAoXCJTZWxlY3QgdGhlIGNvbnRpbmVudCBHcmVlY2UgaXMgaW4uXCIsIFwiQ29udGluZW50cy5zdmdcIiwgW1xuICAgICAgICBcIi5pbnRlcmFjdGl2ZS1jb250aW5lbnRcIlxuICAgIF0pLFxuICAgIG5ldyBHYW1lVG9vbHMuTGFiZWwoXCJzZWNvbmQtbWFwXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuQnV0dG9uRmluZGVyKFwiQXRoZW5zOiBFeHBsb3JlIHRoZSBpdGVtcyFcIiwgbnVsbCwgW1xuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwicmFpc2luZ19oYW5kLnBuZ1wiLCBcIkRlbW9jcmFjeVwiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcImFjcm9wb2xpcy5qcGdcIiwgXCJBY3JvcG9saXNcIiksXG4gICAgICAgIEdhbWVUb29scy5pbWFnZUFuZFRleHQoXCJwYXJ0aGVub24uanBnXCIsIFwiUGFydGhlbm9uXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwiZ2lybC5naWZcIiwgXCJHcmVlayBnaXJsc1wiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcImhvcGxpdGUuanBnXCIsIFwiSG9wbGl0ZXNcIiksXG4gICAgICAgIEdhbWVUb29scy5pbWFnZUFuZFRleHQoXCJ5b3VuZ2JveS5naWZcIiwgXCJZb3VuZyBib3lcIiksXG4gICAgICAgIEdhbWVUb29scy5pbWFnZUFuZFRleHQoXCJob3VzZS5naWZcIiwgXCJIb3VzZVwiKSxcbiAgICAgICAgR2FtZVRvb2xzLmltYWdlQW5kVGV4dChcInRyZWUucG5nXCIsIFwiT2xpdmUgdHJlZVwiKVxuICAgIF0pLFxuICAgIG5ldyBHYW1lVG9vbHMuQ29uZGl0aW9uKG5ldyBHYW1lVG9vbHMuTG9vcCh7IGluZGV4OiBcInRoaXJkLW1hcFwiIH0pLCBuZXcgR2FtZVRvb2xzLkxhYmVsKFwiZmFsbHRocm91Z2hcIikpLFxuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIkluZm9ybWF0aW9uXCIsIHsgc3RyaW5nX3ZhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhdGhlbnNbR2FtZVRvb2xzLmxhc3REYXRhXTtcbiAgICB9fSwgXCJPS1wiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkxvb3AoeyBpbmRleDogXCJzZWNvbmQtbWFwXCJ9KSxcbiAgICBuZXcgR2FtZVRvb2xzLkxhYmVsKFwidGhpcmQtbWFwXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuQnV0dG9uRmluZGVyKFwiU3BhcnRhOiBFeHBsb3JlIHRoZSBpdGVtcyFcIiwgbnVsbCwgW1xuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwidHJlZS5wbmdcIiwgXCJUcmVlXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwiaG9wbGl0ZS5qcGdcIiwgXCJTb2xkaWVyXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwiZ2lybC5naWZcIiwgXCJTcGFydGFuIGdpcmxzXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwiYmFiaWVzLmpwZ1wiLCBcIlNwYXJ0YW4gYmFiaWVzXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwieW91bmdib3kuZ2lmXCIsIFwiU3BhcnRhbiBib3lzXCIpLFxuICAgICAgICBHYW1lVG9vbHMuaW1hZ2VBbmRUZXh0KFwic3RlYWxpbmcuanBnXCIsIFwiU3RlYWxpbmdcIilcbiAgICBdKSxcbiAgICBuZXcgR2FtZVRvb2xzLkNvbmRpdGlvbihuZXcgR2FtZVRvb2xzLkxvb3AoeyBpbmRleDogXCJmb3VydGgtbWFwXCIgfSksIG5ldyBHYW1lVG9vbHMuTGFiZWwoXCJmYWxsdGhyb3VnaFwiKSksXG4gICAgbmV3IEdhbWVUb29scy5JbmZvQm94KFwiSW5mb3JtYXRpb25cIiwgeyBzdHJpbmdfdmFsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNwYXJ0YVtHYW1lVG9vbHMubGFzdERhdGFdO1xuICAgIH19LCBcIk9LXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuTG9vcCh7IGluZGV4OiBcInRoaXJkLW1hcFwifSksXG4gICAgbmV3IEdhbWVUb29scy5MYWJlbChcImZvdXJ0aC1tYXBcIiksXG4gICAgbmV3IEdhbWVUb29scy5EcmFnVGFyZ2V0c1F1ZXN0aW9uKFwiTW91bnQgT2x5bXB1czogTWF0Y2ggdGhlIHN5bWJvbHMgdG8gdGhlIGdvZHMgYW5kIGdvZGRlc3Nlcy5cIiwgW1xuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J2xpZ2h0bmluZy5zdmcnPjwvaW1nPlwiLCB0YXJnZXQ6IFwiPGI+WmV1czwvYj48YnIvPkkgbmVlZCBteSBsaWdodG5pbmcgYm9sdFwiIH0sXG4gICAgICAgIHsgbmFtZTogXCI8aW1nIHNyYz0naGFycC5zdmcnPjwvaW1nPlwiLCB0YXJnZXQ6IFwiPGI+QXBvbGxvPC9iPjxici8+SSBjYW4ndCBwbGF5IG11c2ljIHdpdGhvdXQgYSBoYXJwXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSdwb21lZ3JhbmF0ZS5qcGcnPjwvaW1nPlwiLCB0YXJnZXQ6IFwiPGI+SGVyYTwvYj48YnIvPkkgbmVlZCBteSBwb21lZ3JhbmF0ZVwiIH0sXG4gICAgICAgIHsgbmFtZTogXCI8aW1nIHNyYz0nd2luZ2VkX2Jvb3QuanBnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkhlcm1lczwvYj48YnIvPkkgbmVlZCBteSB3aW5nZWQgYm9vdHNcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J3Jvc2UucG5nJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkFwaHJvZGl0ZTwvYj48YnIvPkkgbG92ZSBteSByb3NlXCIgfSxcbiAgICAgICAgeyBuYW1lOiBcIjxpbWcgc3JjPSdib3dfYW5kX2Fycm93LnBuZyc+PC9pbWc+XCIsIHRhcmdldDogXCI8Yj5BcnRlbWlzPC9iPjxici8+SSBuZWVkIG15IGJvd1wiIH0sXG4gICAgICAgIHsgbmFtZTogXCI8aW1nIHNyYz0nd2hlYXQuc3ZnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkRlbWV0ZXI8L2I+PGJyLz5JIG5lZWQgbXkgd2hlYXRcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J3RyaWRlbnQuc3ZnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPlBvc2VpZG9uPC9iPjxici8+SSBjYW4ndCBmaW5kIG15IHRyaWRlbnRcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J3dpbmUuc3ZnJz48L2ltZz5cIiwgdGFyZ2V0OiBcIjxiPkRpb255c3VzPC9iPjxici8+SSBuZWVkIG15IHdpbmVcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J2hhbW1lci5zdmcnPjwvaW1nPlwiLCB0YXJnZXQ6IFwiPGI+SGVwaGFlc3R1czwvYj48YnIvPkkgbmVlZCBteSBoYW1tZXJcIiB9LFxuICAgICAgICB7IG5hbWU6IFwiPGltZyBzcmM9J3NwZWFyLnN2Zyc+PC9pbWc+XCIsIHRhcmdldDogXCI8Yj5BcmVzPC9iPjxici8+R2l2ZSBtZSBteSBzcGVhclwiIH0sXG4gICAgICAgIHsgbmFtZTogXCI8aW1nIHNyYz0ndHJlZS5wbmcnPjwvaW1nPlwiLCB0YXJnZXQ6IFwiPGI+QXRoZW5hPC9iPjxici8+SSBjYW4ndCBmaW5kIG15IG9saXZlIHRyZWVcIiB9LFxuICAgIF0sIHRydWUsIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuQ29uZGl0aW9uKG5ldyBHYW1lVG9vbHMuTG9vcCh7IGluZGV4OiBcInF1aXpcIiB9KSwgbmV3IEdhbWVUb29scy5MYWJlbChcImZhbGx0aHJvdWdoXCIpKSxcbiAgICBuZXcgR2FtZVRvb2xzLkluZm9Cb3goXCJOb3BlIVwiLCBcIkl0IHNlZW1zIHRoYXQgeW91IGRpZG4ndCBtYXRjaCB0aGUgc3ltYm9scyBwcm9wZXJseS5cIiwgXCJUcnkgYWdhaW5cIiksXG4gICAgbmV3IEdhbWVUb29scy5Mb29wKHsgaW5kZXg6IFwiZm91cnRoLW1hcFwiIH0pLFxuICAgIG5ldyBHYW1lVG9vbHMuTGFiZWwoXCJxdWl6XCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIkdyZWF0IGpvYiFcIiwgXCJUaGUgZ29kcyBhcmUgcGxlYXNlZC5cIiwgXCJPS1wiKSxcbiAgICBuZXcgR2FtZVRvb2xzLkluZm9Cb3goXCJXZWxjb21lIHRvIHRoZSBRdWl6XCIsIFwiTm93IHlvdSdsbCBiZSB0ZXN0ZWQgb24geW91ciBrbm93bGVkZ2Ugb2YgQXRoZW5zLCBTcGFydGEsIGFuZCBNb3VudCBPbHltcHVzLlwiKSxcbiAgICBuZXcgR2FtZVRvb2xzLk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24oXCJBdCB3aGF0IGFnZSBkaWQgYm95cyBmcm9tIFNwYXJ0YSBzdGFydCBnb2luZyB0byBzY2hvb2w/XCIsIFtcbiAgICAgICAgeyBodG1sOiBcIjdcIiwgY29ycmVjdDogdHJ1ZX0sXG4gICAgICAgIHsgaHRtbDogXCIxNlwiIH0sXG4gICAgICAgIHsgaHRtbDogXCJUaGV5IGRpZG4ndCFcIiB9XG4gICAgXSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5NdWx0aXBsZUNob2ljZVF1ZXN0aW9uKFwiV2hvIHdlcmUgdGhlIHRlbXBsZXMgb24gdGhlIEFjcm9wb2xpcyBidWlsdCBmb3I/XCIsIFtcbiAgICAgICAgeyBodG1sOiBcIlRoZSBnb2RzXCIsIGNvcnJlY3Q6IHRydWV9LFxuICAgICAgICB7IGh0bWw6IFwiUmljaCBwZW9wbGVcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiU29sZGllcnNcIiB9XG4gICAgXSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5NdWx0aXBsZUNob2ljZVF1ZXN0aW9uKFwiV2hpY2ggZ29kIG9yIGdvZGRlc3MgZ2F2ZSBhbiBvbGl2ZSB0cmVlIHRvIEF0aGVucz9cIiwgW1xuICAgICAgICB7IGh0bWw6IFwiQXRoZW5hXCIsIGNvcnJlY3Q6IHRydWV9LFxuICAgICAgICB7IGh0bWw6IFwiQXJ0ZW1pc1wiIH0sXG4gICAgICAgIHsgaHRtbDogXCJBcGhyb2RpdGVcIiB9XG4gICAgXSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5NdWx0aXBsZUNob2ljZVF1ZXN0aW9uKFwiQXQgd2hhdCBhZ2UgZGlkIGdpcmxzIGZyb20gU3BhcnRhIHN0YXJ0IGdvaW5nIHRvIHNjaG9vbD9cIiwgW1xuICAgICAgICB7IGh0bWw6IFwiN1wiIH0sXG4gICAgICAgIHsgaHRtbDogXCIxNlwiIH0sXG4gICAgICAgIHsgaHRtbDogXCJUaGV5IGRpZG4ndCFcIiwgY29ycmVjdDogdHJ1ZSB9XG4gICAgXSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5NdWx0aXBsZUNob2ljZVF1ZXN0aW9uKFwiV2hpY2ggZ29kIHdhcyB3b3JzaGlwcGVkIGluIHRoZSBQYXJ0aGVub24/XCIsIFtcbiAgICAgICAgeyBodG1sOiBcIkF0aGVuYVwiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIlpldXNcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiQXJpc3RvdGxlXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIlNwYXJ0YW4gZ2lybHMga2VwdCBmaXQgc28gdGhleSBjb3VsZCBoYXZlLi4uP1wiLCBbXG4gICAgICAgIHsgaHRtbDogXCJIZWFsdGh5IGJhYmllc1wiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIkZ1blwiIH0sXG4gICAgICAgIHsgaHRtbDogXCJBIGxhdWdoXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIlNwYXJ0YW4gYm95cyB3ZXJlIGtlcHQgaHVuZ3J5LCBzbyB0aGV5IGhhZCB0by4uLlwiLCBbXG4gICAgICAgIHsgaHRtbDogXCJTdGVhbCBmb29kIVwiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIkZpZ2h0IGEgbG90IVwiIH0sXG4gICAgICAgIHsgaHRtbDogXCJCb3Jyb3cgbW9uZXkhXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIldoYXQgd2FzIFNwYXJ0YSBzdXJyb3VuZGVkIGJ5IHRvIHByb3RlY3QgaXQ/XCIsIFtcbiAgICAgICAgeyBodG1sOiBcIk1vdW50YWluc1wiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIkFuIGFybXkgb2YgU3BhcnRhbnNcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiTWFjaGluZSBndW5zXCIgfVxuICAgIF0sIHRydWUpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIldoYXQgdHlwZSBvZiBTcGFydGFuIGJhYnkgd2FzIGxlZnQgdG8gZGllP1wiLCBbXG4gICAgICAgIHsgaHRtbDogXCJXZWFrIGJhYmllc1wiLCBjb3JyZWN0OiB0cnVlfSxcbiAgICAgICAgeyBodG1sOiBcIkZhdCBiYWJpZXNcIiB9LFxuICAgICAgICB7IGh0bWw6IFwiSW5jb25zb2xhYmxlIGJhYmllc1wiIH1cbiAgICBdLCB0cnVlKSxcbiAgICBuZXcgR2FtZVRvb2xzLk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24oXCJXaGljaCBnb2Qgd2FzIHJlc3BvbnNpYmxlIGZvciBwcm90ZWN0aW5nIEF0aGVucz9cIiwgW1xuICAgICAgICB7IGh0bWw6IFwiQXRoZW5hXCIsIGNvcnJlY3Q6IHRydWV9LFxuICAgICAgICB7IGh0bWw6IFwiUG9zZWlkb25cIiB9LFxuICAgICAgICB7IGh0bWw6IFwiUGxhdG9cIiB9XG4gICAgXSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5MYWJlbChcImhhY2sxXCIpLFxuICAgIG5ldyBHYW1lVG9vbHMuTXVsdGlwbGVDaG9pY2VRdWVzdGlvbihcIlRoZSB0d2VsdmUgZ29kcyBhbmQgZ29kZGVzc2VzIGxpdmVkIG9uLi4uXCIsIFtcbiAgICAgICAgeyBodG1sOiBcIk1vdW50IE9seW1wdXNcIiwgY29ycmVjdDogdHJ1ZX0sXG4gICAgICAgIHsgaHRtbDogXCJNeSByb29mXCIgfSxcbiAgICAgICAgeyBodG1sOiBcIkFuIGlzbGFuZCBpbiBHcmVlY2VcIiB9XG4gICAgXSwgdHJ1ZSksXG4gICAgbmV3IEdhbWVUb29scy5JbmZvQm94KFwiVGhhbmtzIGZvciBwbGF5aW5nIVwiLCBcIklmIHlvdSB3YW50IHRvIHBsYXkgYWdhaW4sIHlvdSBjYW4gcmVmcmVzaCB0aGUgcGFnZS5cIiwgbnVsbCksXG5dO1xuJCh3aW5kb3cpLm9uKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcbiAgICAkKFwiLnNlLXByZS1jb25cIikuZmFkZU91dChcInNsb3dcIik7XG4gICAgR2FtZVRvb2xzLnJlc2V0U3lzdGVtKCk7XG4gICAgR2FtZVRvb2xzLnJlc3RhcnQoKTtcbn0pOyJdfQ==
