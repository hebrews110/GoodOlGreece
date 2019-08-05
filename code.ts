/// <reference path="node_modules/@types/jquery/index.d.ts" />
/// <reference path="node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="node_modules/@types/bootstrap/index.d.ts" />
/// <reference path="node_modules/@types/browserify/index.d.ts" />
/// <reference path="node_modules/@types/modernizr/index.d.ts" />


declare interface String {
    string_val(): string;
}

String.prototype.string_val = function() {
    return this;
}
namespace GameTools {
    (function($) {
        ($.fn as any).randomize = function(childElem) {
            function shuffle(o) {
                for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            };
            return this.each(function() {
                var $this = $(this);
                var elems = $this.children(childElem);
    
                shuffle(elems);
    
                elems.each(function() {
                    $(this).detach();
                });
    
                for(var i=0; i < elems.length; i++) {
                    $this.append(elems[i]);      
                }
            });    
        }
    })(jQuery);
    export let currentLevel = 0;
    export let contentsIndex = 0;
    export let lastResult: boolean = false;
    export let lastData: any = null;
    export let gameContents: GameTools.DisplayedItem[] = [];
    export let defaultNextItem = function(current: GameTools.DisplayedItem): GameTools.DisplayedItem {
        if(contentsIndex == gameContents.length - 1) {
            console.error("No next items");
            return null;
        }
        console.log("Get from index " + (contentsIndex + 1));
        return gameContents[++contentsIndex];
    };
    export let currentlyDisplayed = function(): GameTools.DisplayedItem {
        return gameContents[contentsIndex];
    };

    export abstract class DisplayedItem {
        private _isDisplaying = false;
        public isDisplaying(): boolean {
            return this._isDisplaying;
        }
        constructor() {
            this._isDisplaying = false;
            this.reset();
        }
        myIndex(): number {
            return gameContents.indexOf(this);
        }
        display(): void {
            this._isDisplaying = true;
        }
        undisplay(): void {
            this._isDisplaying = false;
        }
        getNextItem(): DisplayedItem {
            if (defaultNextItem != null)
                return defaultNextItem(this);
            else
                throw new Error("No default next item provided");
        }
        public redisplay(): void {
            var index = this.myIndex();
            if(index == -1)
                throw "redisplay() requires an in-array element";
            this.undisplay();
            var loop = constructLoop({ index: index, relative: false});
            setTimeout(() => {
                loop.display();
            }, 0);
        }
        public displayNext(): void {
            this.undisplay();
            let item = this.getNextItem();
            setTimeout(() => {
                if(item !== null)
                    item.display();
            }, 0);
        }
        reset(): void {

        }
    }

    /**
    * Shuffles array in place.
    * @param {Array} a items An array containing the items.
    */
    export function shuffle<T>(a: T[]): T[] {
        let j: number, x: T, i: number;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    interface GameString {
        string_val(): string;
    }
    export class InfoBox extends DisplayedItem {
        private modalDisplayed = false;
        public static readonly defaultDelay = 1000;
        private wantsToRedisplay = false;
        constructor(protected title: GameString, protected text: GameString, protected buttonText: GameString = "OK", protected delay = InfoBox.defaultDelay) {
            super();
        }
        protected dialogCreated(): void {

        }
        protected buttonCallback(e: JQuery.ClickEvent): void {
            this.displayNext();
        }
        redisplay(): void {
            this.wantsToRedisplay = true;
            if(this.modalDisplayed) {
                $("#question-dialog").modal('hide');
            } else {
                super.redisplay();
            }
        }
        displayNext(): void {
            this.wantsToRedisplay = false;
            if(this.modalDisplayed) {
                $("#question-dialog").modal('hide');
            } else {
                super.displayNext();
            }
        }
        display(): void {
            setTimeout(() => {
                $('#question-dialog').removeData();
                if(this.title != null)
                    $("#question-dialog .modal-title").html(this.title.string_val());
                else
                    $("#question-dialog .modal-title").html("");
                if(this.text != null) {
                    $("#question-dialog .modal-body").show();
                    $("#question-dialog .modal-body").html(this.text.string_val());
                } else {
                    $("#question-dialog .modal-body").html("");
                    $("#question-dialog .modal-body").hide();
                }

                /* Generate the button */
                $("#question-dialog .modal-footer").empty();
                $("#question-dialog .modal-footer").append($("<button></button>").addClass("btn btn-primary").attr("type", "button"));
                if(this.buttonText != null && this.buttonText.string_val() != "") {
                    $("#question-dialog .close").show();
                    $("#question-dialog .modal-footer").show();
                    $("#question-dialog .modal-footer button").text(this.buttonText.string_val());
                } else {
                    $("#question-dialog .close").hide();
                    $("#question-dialog .modal-footer").hide();
                }
                this.dialogCreated();
                $("#question-dialog .modal-footer button").off("click");
                $("#question-dialog .modal-footer button").on("click", (e) => {
                    this.buttonCallback(e);
                });
                $("#question-dialog").modal( { backdrop: "static" });
                this.modalDisplayed = true;
                $("#question-dialog").one("shown.bs.modal", (): void => {
                    
                });
                $("#question-dialog").one("hidden.bs.modal", (): void => {
                        this.modalDisplayed = false;
                        $("#question-dialog").modal('dispose');
                        if(this.wantsToRedisplay)
                            this.redisplay();
                        else
                            this.displayNext();
                });
                
           }, this.delay);
        }
    }

    export class Delay extends DisplayedItem {
        constructor(protected time: number) {
            super();
        }
        display(): void {
            setTimeout(() => {
                this.displayNext();
            }, this.time);
        }
    }
    export class LevelChoice extends InfoBox {
        constructor(protected levelMarkups: (GameString)[]) {
            super("Choose a level", "", null);
        }
        protected dialogCreated(): void {
            $("#question-dialog .modal-body").text("");
            let $container = $("<div></div>");
            $container.addClass("level-buttons");
            this.levelMarkups.forEach((element, index) => {
                
                let $button = $("<button></button>");
                $button.html(element.string_val());
                $button.data("level-id", index);
                $button.click(() => {
                    GameTools.currentLevel = $button.data("level-id");
                    $("#question-dialog").modal('hide');
                });
                $container.append($button);
            });
            $("#question-dialog .modal-body").append($container);
        }
    }
    export function getRandomInt(min : number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    export function getRandomArbitrary(min: number, max: number): number {
        let val = Math.random() * (max - min) + min;
        return val;
    }
    export function playAudioIfSupported(audioFile: GameString, cb?: () => void): void {
        if(!cb)
            cb = function() {};
        if(Modernizr.audio) {
            var audio = new Audio(audioFile.string_val());
            audio.onerror = function() {
                cb();
            }
            audio.addEventListener("ended", cb);
            audio.play();
        } else
            cb();
    }
    
    export class Label extends GameTools.DisplayedItem {
        constructor(public name: GameString) {
            super();
        }
        display(): void {
            this.displayNext();
        }
    }
    export interface LoopInfo {
        index: number | string;
        relative?: boolean;
    }
    export class Loop extends GameTools.DisplayedItem {
        
        private numLoops = 0;
        constructor(public loopInfo: LoopInfo, public times = -1) {
            super();
            if(typeof this.loopInfo.index == "number" && this.loopInfo.index < 0)
                this.loopInfo.relative = true;
            else if(this.loopInfo.relative === undefined)
                this.loopInfo.relative = true;
        }
        /* Restore a previous loop */
        addLoop(): void {
            this.numLoops--;
            if(this.numLoops < -1)
                this.numLoops = -1;
        }
        getNumTimesLooped(): number {
            return this.numLoops;
        }
        display(): void {
            if(this.times < 0 || this.numLoops < this.times) {
                
                if(typeof this.loopInfo.index == "number") {
                    if(this.loopInfo.relative && this.myIndex() == -1)
                        throw "Not in gameContents array, cannot use relative branch";
                    if(!this.loopInfo.relative)
                        contentsIndex = this.loopInfo.index;
                    else
                        contentsIndex += this.loopInfo.index;
                } else {
                    let labels = GameTools.gameContents.filter(e => e instanceof Label);
                    let theLabel = null;
                    labels.some(e => {
                        let label = (e as Label);
                        if(label.name == this.loopInfo.index) {
                            theLabel = label;
                            return true;
                        }
                        return false;
                    });
                    if(theLabel == null)
                        throw "Undefined label: " + this.loopInfo.index;
                    contentsIndex = theLabel.myIndex();
                }
                contentsIndex -= 1;
                this.numLoops++;
            }
            if(this.times < 0)
                this.numLoops = 0;
            this.displayNext();
        }
        reset(): void {
            this.numLoops = 0;
        }
    }
    function constructLoop(loopInfo: LoopInfo, times = -1) {
        return new Loop(loopInfo, times);
    }
    export class SystemReset extends GameTools.DisplayedItem {
        display(): void {
            GameTools.resetSystem();
            this.displayNext();
        }
    }
    export function resetSystem(): void {
        gameContents.forEach(displayedItem => {
            displayedItem.reset();
        });
    }
    export function restart(): void {
        if(gameContents[contentsIndex].isDisplaying()) {
            gameContents[contentsIndex].undisplay();
        }
        contentsIndex = 0;
        gameContents[contentsIndex].display();
    }
    export interface DragTargetsQuestionItem {
        target: GameString;
        name: GameString;
    }

    function cancelTooltipTimeout($target: JQuery): void {
        var timeout = $target.data("tooltip-timeout");
        if(timeout) {
            clearTimeout(timeout);
            $target.removeData("tooltip-timeout");
        }
    }
    export function HSLToHex(h,s,l) {
        s /= 100;
        l /= 100;
      
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r: string | number = 0,
            g: string | number = 0,
            b: string | number = 0;
      
        if (0 <= h && h < 60) {
          r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
          r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
          r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
          r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
          r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
          r = c; g = 0; b = x;
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
    export function getContrastYIQ(hexcolor){
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'white';
    }
    export class DragTargetsQuestion extends InfoBox {
        static alwaysBeRight = false;
        constructor(protected title: GameString, protected items: DragTargetsQuestionItem[], protected shuffleTargets = false, protected shuffleOptions = false) {
            super(title, "", "Check");
        }
        buttonCallback(e: JQuery.ClickEvent): void {
            var $itemsDiv = $("#question-dialog .modal-body .items-div");
            var $targetsDiv =  $("#question-dialog .modal-body .targets-div");
            if(!DragTargetsQuestion.alwaysBeRight && $itemsDiv.children().length > 0) {
                GameTools.lastResult = false;
            } else {
                var $dragItems = $targetsDiv.find(".drag-item");
                GameTools.lastResult = true;
                if(!DragTargetsQuestion.alwaysBeRight)
                    $dragItems.each((index, element): false | void => {
                        if(!($(element).data("target") as JQuery<HTMLElement>).is($(element).parent())) {
                            GameTools.lastResult = false;
                            return false;
                        }
                    });
            }
            super.buttonCallback(e);
        }
        dialogCreated(): void {
            var $targetsDiv = $("<div></div>");
            var $itemsDiv = $("<div></div>");
            var $bothDivs =  $targetsDiv.add($itemsDiv);
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
            this.items.forEach(item => {
                const target = item.target;
                let $span = $("<span></span>").html(target.string_val());
                let $div = $("<div></div>").append($span).addClass("target");
                $div.data("my-text", target);
                $targetsDiv.append($div);
                $div.append($("<i></i>").addClass("fas fa-question-circle").click(function() {
                    var $target = $(this).parent();
                    cancelTooltipTimeout($target);
                    $target.tooltip('show');
                    $target.data("tooltip-timeout", setTimeout(() => {
                        $target.tooltip('hide');
                    }, 3000));
                }));
                $div.children("i").hide();


                const $targetDiv = $div;
                const backColor = HSLToHex(getRandomInt(0, 360), 100, 90);
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
            if(this.shuffleTargets)
                ($targetsDiv as any).randomize();
            if(this.shuffleOptions)
                ($itemsDiv as any).randomize();
             
            let gtBeforeDropFunction = function (event, ui) {
                console.log("gt before drop");
                if($(this).hasClass("target")) {
                    $(this).tooltip('enable');
                    $(this).children("i").show();
                    $(this).children("span").hide();
                }
            }
            let dropFunction = function( event, ui ) {
                $(this).trigger("gt.before_drop");
                let $draggable = $(document).find(".ui-draggable-dragging");
                if(!$draggable.get(0)) {
                    $draggable = $(this).children(".drag-item");
                    if(!$draggable.get(0)) {
                        throw "Can't find draggable";
                    }
                }
                console.log($draggable[0]);
                $draggable.css({
                    "top": "",
                    "left": ""
                });
                var $newParent = $(this);
                if($(this).hasClass("target") && $(this).find(".drag-item").length != 0) {
                    $newParent = $itemsDiv;
                }
                $draggable.detach().appendTo($newParent);
                console.log(this);
                if($newParent.is($itemsDiv))
                    $draggable.css({ "position": "relative"});
            };
            let outFunction = function (event, ui) {
                console.log("out");
                if($(this).hasClass("target") && $(this).children(".drag-item").hasClass("ui-draggable-dragging")) {
                    console.log($(this).children().get(0));
                    $(this).children("i").hide();
                    $(this).children("span").show();
                    $(this).tooltip('disable');
                }
            };
            let dragInfo: JQueryUI.DraggableOptions = {
                containment: $('body'),
                start: function (event, ui) {
                    $(ui.helper).css({ "transform": "none"});
                    $(this).data("startingScrollTop",$(this).parent().scrollTop());
                    
                },
                revert: function (droppable) {
                    if(!droppable) {
                        console.log("Reverting!");
                        $(this).parent().trigger("gt.before_drop");
                        return true;
                    } else
                        return false;
                },
                drag: function (event, ui) {
                    if($(ui.helper).parent().hasClass("target")) {
                        $(ui.helper).parent().tooltip("hide");
                        cancelTooltipTimeout($(ui.helper).parent());
                    }
                },
                stop: function (event, ui) {
                    $(ui.helper).css({ "transform": ""});
                },
                scroll: false,
            };
            console.log("should not scroll");
            $targetsDiv.children("div").droppable().on("drop", dropFunction).on("dropout", outFunction).on("gt.before_drop", gtBeforeDropFunction);
            $itemsDiv.droppable().on("drop", dropFunction).on("dropout", outFunction);
            $itemsDiv.children("div").draggable(dragInfo);
        }
    }
    export class FunctionDisplayedItem extends DisplayedItem {
        constructor(private func: () => void) {
            super();
        }
        display(): void {
            this.func();
            this.displayNext();
        }
    }
    export class Condition extends DisplayedItem {
        constructor(public trueStatement: DisplayedItem, public falseStatement: DisplayedItem, public customCondition?: () => boolean) {
            super();
            if(this.customCondition === undefined)
                this.customCondition = function() {
                    return GameTools.lastResult;
                };
        }
        display(): void {
            if(this.customCondition())
                this.trueStatement.display();
            else
                this.falseStatement.display();
        }
        reset(): void {
            if(this.trueStatement)
                this.trueStatement.reset();
            if(this.falseStatement)
                this.falseStatement.reset();
        }
    }
    export class InteractiveSVG extends InfoBox {
        constructor (title: GameString, public imgSrc: GameString, public interactiveComponents?: GameString[]) {
            super(title, "", null);
        }
        static scrollHandler(): void {
            var scrollLeft = ($(".interactive-svg img").width() - $(".interactive-svg").width()) / 2;
            $(".interactive-svg").scrollLeft(scrollLeft);
        }
        interactiveComponentClicked($component: JQuery<SVGElement>): void {
            GameTools.lastData = $component;
            this.displayNext();
        }
        dialogCreated(): void {
            let $svgContainer = $("<div></div>");
            let $img = $("<img></img>");
            $svgContainer.addClass("interactive-svg");
            $svgContainer.load(this.imgSrc.string_val(), () => {
                if(this.interactiveComponents)
                    this.interactiveComponents.forEach((selector, index) => {
                        var svg = $svgContainer.find("svg").get(0);

                        let elements = svg.querySelectorAll(selector.string_val());
                        elements.forEach(element => {
                            $(element).addClass("interactive-component");
                            $(element).click((e) => {
                                this.interactiveComponentClicked(($(e.target) as JQuery<Element>) as JQuery<SVGElement>);
                            });
                        });
                        
                    });
            });
            $("#question-dialog .modal-body").append($svgContainer);
            $(window).off("resize", InteractiveSVG.scrollHandler);
            $(window).on("resize", InteractiveSVG.scrollHandler);
        }
        undisplay(): void {
            super.undisplay();
            $(window).off("resize", InteractiveSVG.scrollHandler);
        }
    }
    export class Finder {
        public itemsFound: number;
        private itemIndexes: any[] = [];
        public static readonly defaultKeyword = "found";
        public $componentFound: JQuery;
        constructor(public parent: DisplayedItem, public numItems: number, public keyword = Finder.defaultKeyword) {
            this.reset();
        }
        reset(): void {
            this.itemIndexes = [];
            this.itemsFound = 0;
        }
        setTitle(): void {
            if(this.itemsFound > 0)
                $("#question-dialog .modal-title").text("You have " + this.keyword + " " + this.itemsFound + " of " + this.numItems + " items.");
        }
        itemFound($component: JQuery<any>): void {
            
            if(this.itemIndexes.indexOf($component.data("index")) == -1) {
                this.itemsFound++;
                this.itemIndexes.push($component.data("index"));
            }
            this.$componentFound = $component;
            this.parent.displayNext();
        }
        finished(): boolean {
            return this.itemsFound == this.numItems;
        }
    }
    export class InteractiveSVGFinder extends InteractiveSVG {
        finder: Finder;
        constructor(title: GameString, public imgSrc: GameString, interactiveComponents: (GameString)[], public numItems: number) {
            super(title, imgSrc, interactiveComponents);
            this.finder = new Finder(this, numItems);
        }
        public itemsFound = 0;
        interactiveComponentClicked($component: JQuery<SVGElement>): void {
            this.finder.itemFound($component);
        }
        reset(): void {
            if(this.finder != null)
                this.finder.reset();
            super.reset();
        }
    }
    export class ButtonFinder extends InfoBox {
        finder: Finder;
        didDisplay = false;
        foundIndexes: number[];
        constructor(title: GameString, public instructions: GameString, public buttons: (GameString)[], public delay = InfoBox.defaultDelay) {
            super(title, instructions, null, delay);
            this.finder = new Finder(this, buttons.length, "explored");
            this.foundIndexes = [];
        }
        reset(): void {
            if(this.finder != null)
                this.finder.reset();
            super.reset();
            this.foundIndexes = [];
            this.didDisplay = false;
        }
        displayNext(): void {
            if(this.didDisplay)
                GameTools.lastResult = false;
            else
                GameTools.lastResult = this.finder.finished();
            console.log(this.finder.$componentFound.get(0));
            GameTools.lastData = this.finder.$componentFound.data("index");
            super.displayNext();
        }
        display(): void {
            if(this.finder.finished()) {
                this.didDisplay = false;
                this.displayNext();
            } else {
                this.didDisplay = true;
                super.display();
            }
        }
        dialogCreated(): void {
            var $body = $("#question-dialog .modal-body");
            $body.html("");
            $body.show();

            if(this.instructions != null)
                $body.append($("<span></span>").html(this.instructions.string_val()));
            this.finder.setTitle();
            var $finderButtons = $("<div></div>").addClass("finder-buttons").appendTo($body);
            this.buttons.forEach((element, index) => {
                var $button = $("<button></button>").html(element.string_val());
                if(this.foundIndexes.indexOf(index) != -1) {
                    $button.addClass("was_found");
                }
                $button.data("index", index);
                $button.data("element", element);
                $button.click((e) => {
                    $finderButtons.children("button").prop("disabled", true);
                    this.foundIndexes.push($(e.target).data("index"));
                    this.finder.itemFound($(e.target));
                });
                $finderButtons.append($button);
            });
        }
    }
    export function imageAndText(imgSrc: GameString, text: GameString): string {
        return "<img src='" + imgSrc + "'></img>" + text;
    }
    export class TrueFalseQuestion extends InfoBox {
        constructor(question: GameString, protected correctAnswer?: boolean) {
            super(question, null, "True");
        }
        buttonCallback(e: JQuery.ClickEvent): void {
            const isTrue = $(e.target).text() == "True";
            if(this.correctAnswer !== undefined) {
                GameTools.lastResult = isTrue == this.correctAnswer;
            } else
                GameTools.lastResult = isTrue;
           
            super.buttonCallback(e);
        }
        dialogCreated(): void {
            var $footer = $("#question-dialog .modal-footer");
            $footer.append($("<button></button>").addClass("btn btn-secondary").text("False").click(this.buttonCallback));
        }
    }
    export interface QuestionOption {
        html: GameString;
        correct?: boolean;
    }
    export class MultipleChoiceQuestion extends InfoBox {
        constructor(question: GameString, protected choices: QuestionOption[], protected shouldReDisplay = false) {
            super("Choose one of the choices.", question, null);
        }
        answered($button: JQuery<HTMLElement>): void {
            let option: QuestionOption = $button.data("questionOption");
            if(option.correct) {
                GameTools.lastResult = true;
                this.displayNext();
            } else {
                GameTools.lastResult = false;
                this.title = "Sorry, that wasn't the correct answer.";
                if(this.shouldReDisplay)
                    this.redisplay();
                else
                    this.displayNext();
            }
        }
        dialogCreated(): void {
            var $body = $("#question-dialog .modal-body");
            var $finderButtons = $("<div></div>").addClass("finder-buttons").appendTo($body);
            shuffle(this.choices).forEach((element, index) => {
                var $button = $("<button></button>").html(element.html.string_val());
                const backColor = HSLToHex(getRandomInt(0, 360), 100, 90);
                $button.css({
                    "background-color": backColor,
                    "color": getContrastYIQ(backColor)
                });
                $button.data("index", index);
                $button.data("questionOption", element);
                $button.click((e) => {
                    $finderButtons.children("button").prop("disabled", true);
                    this.answered($button);
                });
                $finderButtons.append($button);
            });
        }
    }
    export function monkeyPatch() {
        $.widget("ui.draggable", ($.ui as any).draggable, {

            _mouseStart: function(event) {
              this._super(event);
              this.origScroll = this.options.scroll;
              if (this.cssPosition==="fixed" || this.hasFixedAncestor) {
                this.options.scroll = false;
              }
            },
        
            _mouseStop: function(event) {
              this._super(event);
              this.options.scroll = this.origScroll;
            }
        
        });
    }
}

class GreeceInteractiveMap extends GameTools.InteractiveSVG {
    interactiveComponentClicked($component: JQuery<SVGElement>): void {
        if($component.attr("id") != "Europe") {
            $("#question-dialog .modal-title").text("Nope, that's " + $component.attr("id").replace('_', ' '));
        } else {
            $("#question-dialog").modal('hide');
        }
    }
}

let athens: string[] = [
    "Only men were allowed to vote in Athens. Voting took place by use of a hand-count. Ballots weren't commonly used back then!",
    "The Acropolis is a hill in Athens that temples for the gods and goddesses were built on.",
    "The Parthenon is a temple that was originally built to honor the goddess Athena. Though it was built thousands of years ago, it is still standing today.",
    "Girls did not attend school in Athens; instead, they were taught by their mothers how to cook, clean, and do other maternal duties.",
    "Boys in Athens spent 2 years training to be soldiers when they reached 18. They had the letter A painted on their shield. Athenian boys had to buy their own weapons.",
    "Athenian boys went to school at the age of 7. They learned reading, writing, music, and poetry. At 18 they left to join the military.",
    "In Athens, people lived in houses built below the Acropolis.",
    "The olive tree was believed to have been given to Athens as a gift by the goddess Athena."
];
let sparta: string[] = [
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
        { name: "1066 A.D.", target:  "The Battle of Hastings" },
        { name: "1952 A.D.", target: "Queen Elizabeth II crowned" }
    ], false, true),
    new GameTools.Condition(new GameTools.Loop({ index: "dq_correct" }), new GameTools.Loop({ index: "dq_incorrect" })),
    new GameTools.Label("dq_correct"),
    new GameTools.InfoBox("Great job!", "You must know what you're doing!", "Continue"),
    new GameTools.Loop({ index: "first-map"}),
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
    new GameTools.InfoBox("Information", { string_val: function() {
        return athens[GameTools.lastData];
    }}, "OK", 0),
    new GameTools.Loop({ index: "second-map"}),
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
    new GameTools.InfoBox("Information", { string_val: function() {
        return sparta[GameTools.lastData];
    }}, "OK", 0),
    new GameTools.Loop({ index: "third-map"}),
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
        { html: "7", correct: true},
        { html: "16" },
        { html: "They didn't!" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Who were the temples on the Acropolis built for?", [
        { html: "The gods", correct: true},
        { html: "Rich people" },
        { html: "Soldiers" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Which god or goddess gave an olive tree to Athens?", [
        { html: "Athena", correct: true},
        { html: "Artemis" },
        { html: "Aphrodite" }
    ], true),
    new GameTools.MultipleChoiceQuestion("At what age did girls from Sparta start going to school?", [
        { html: "7" },
        { html: "16" },
        { html: "They didn't!", correct: true }
    ], true),
    new GameTools.MultipleChoiceQuestion("Which god was worshipped in the Parthenon?", [
        { html: "Athena", correct: true},
        { html: "Zeus" },
        { html: "Aristotle" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Spartan girls kept fit so they could have...?", [
        { html: "Healthy babies", correct: true},
        { html: "Fun" },
        { html: "A laugh" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Spartan boys were kept hungry, so they had to...", [
        { html: "Steal food!", correct: true},
        { html: "Fight a lot!" },
        { html: "Borrow money!" }
    ], true),
    new GameTools.MultipleChoiceQuestion("What was Sparta surrounded by to protect it?", [
        { html: "Mountains", correct: true},
        { html: "An army of Spartans" },
        { html: "Machine guns" }
    ], true),
    new GameTools.MultipleChoiceQuestion("What type of Spartan baby was left to die?", [
        { html: "Weak babies", correct: true},
        { html: "Fat babies" },
        { html: "Inconsolable babies" }
    ], true),
    new GameTools.MultipleChoiceQuestion("Which god was responsible for protecting Athens?", [
        { html: "Athena", correct: true},
        { html: "Poseidon" },
        { html: "Plato" }
    ], true),
    new GameTools.Label("hack1"),
    new GameTools.MultipleChoiceQuestion("The twelve gods and goddesses lived on...", [
        { html: "Mount Olympus", correct: true},
        { html: "My roof" },
        { html: "An island in Greece" }
    ], true),
    new GameTools.InfoBox("Thanks for playing!", "If you want to play again, you can refresh the page.", null),
];
$(window).on("load", function() {
    $(".se-pre-con").fadeOut("slow");
    GameTools.monkeyPatch();
    GameTools.resetSystem();
    GameTools.restart();
});