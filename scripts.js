google.charts.load('current', {'packages': ['corechart', 'gauge', 'bar']});

var skipLT = ["ST_02_001", "ER_01_001", "ER_01_002", "ER_01_003", "ER_01_004"];

var gaugeOptions = {
    redFrom: 0,
    redTo: 40,
    yellowFrom: 40,
    yellowTo: 80,
    greenFrom: 80,
    greenTo: 100,
    minorTicks: 5,
    width: 110,
    height: 110
};
var gaugeLevelsOptions = {
    redFrom: 0,
    redTo: 40,
    yellowFrom: 40,
    yellowTo: 80,
    greenFrom: 80,
    greenTo: 100,
    minorTicks: 5,
    width: 110,
    height:110
};
/*var posChartOptions = {
    width: 500,
    height: 300,
    orientation: "vertical",
    legend: {
        position: 'none'
    }
};*/

var language;

function changeView() {
    var lang = $("#simp-select").val();
    $(".simp-ff").css("display", "none");
    $("#simp-" + lang).css("display", "block");
    return false;
}

function escapeAttrNodeValue(value) {
    return value.replace(/(&)|(")|(\u00A0)/g, function (match, amp, quote) {
        if (amp) return "&amp;";
        if (quote) return "&quot;";
        return "&nbsp;";
    });
}

function addLI(ul, title, value) {
    var li = $("<li></li>");
    li.addClass("list-group-item");
    var span = $("<span></span>");
    span.addClass("badge");
    span.append(value);
    li.append(span);
    li.append(" " + title);
    ul.append(li);
}

function newInput(name, checked) {
    var input = $("<input>");
    input.attr("type", "checkbox");
    input.addClass("js-switch");
    if (checked) {
        input.attr("checked", "checked");
    }
    input.attr("name", name);
    input.attr("id", "switch-" + name);
    return input;
}

/*function updateSyntSimpText(i, lang) {
    var c = $("#switch-" + i + "-main").prop("checked");
    var orig = $("#origsentence" + i);
    var synt = $("#syntsentence" + i);
    var spinner = $("#spinner-" + i);

    if (c) {
        if (lang === "it") {
            var comp = $("#switch-" + i + "-comp").prop("checked");

            orig.hide();
            synt.show();
        }
        else {
            var comp = $("#switch-" + i + "-comp").prop("checked");
            var conf = $("#switch-" + i + "-conf").prop("checked");

            var data = {
                text: orig.html(),
                comp: comp ? "true" : "false",
                conf: conf ? "true" : "false",
                lang: language
            };

            spinner.show();

            $.ajax("../syntsimp", {
                dataType: "json",
                method: "POST",
                data: data,
                success: function (data) {
                    synt.removeClass();
                    spinner.hide();
                    if (data.isSyntSimplified) {
                        synt.addClass("synt-simp-sent");
                    }
                    synt.html(data.syntSimplifiedVersion);

                    orig.hide();
                    synt.show();
                }
            });
        }
    }
    else {
        orig.show();
        synt.hide();
    }
}*/

$(function () {

    $('[data-toggle="tooltip"]').tooltip()

    $('#select_examples').change(function () {
        $('#text').val($('#select_examples').val());
    });

    $('button.has-spinner').click(function () {

       var text = $('#text').val();
        if (text.length < 3) {
             alert("Enter some text");
             return false;
        }

        $(this).toggleClass('active');
        $(this).toggleClass('disabled');
        $('#text').attr('disabled', 'disabled');

        //$.ajax("../simpform", {
        //$.ajax("simp",{
        $.ajax("http://dh-server.fbk.eu:19003/simp-engines/tae/simpform", {
            dataType: "json",
            method: "POST",
            data: {
                text: text
            },

            success: function (data) {

                $("#part1").slideUp(500);

                var fileJson = JSON.stringify(data, undefined, 4);
                
                $('#showJson').text(fileJson);

                language = data.readability.language;
                $(".show-" + language).show();
                // Show language

                var infoLabel = $("<div></div>");
                infoLabel.append('<p class="font-weight-bold size">Click on each word to get more information</p>'); 
                $("#infoText").append(infoLabel);
                
                $.each(data.sentences, function (i, item) {
                    var p = $("<div></div>");
                    var contentWords = 0;
                    var easyWords = 0;
                    var levels = [];
                    for (var j = 0; j < 3; j++) {
                        levels[j] = 0;
                    }
                    var simpText = item.text;

                    $.each(item.tokens.reverse(), function (j, token) {
                        var start = token.characterOffsetBegin - item.characterOffsetBegin;
                        var end = token.characterOffsetEnd - item.characterOffsetBegin;
                        var index = token.index;
                        var before = "";
                        var after = "";
                        var page;
                        var pos=token.characterOffsetBegin;
                        var color;

                        if (token.pos != "FB") {
                            before = '<span tabindex="0" data-html="true" data-container="body" data-toggle="popover" role="button" title="Detailed information" class="word_hover my-popover label label-default ';
                            if (token.pos.startsWith('R')) {
                                before += 'pos-r" ';
                            } else if (token.pos.startsWith('V') || token.pos.startsWith('M')) {
                                before += 'pos-vm" ';
                            } else if (token.pos.startsWith('A')) {
                                before += 'pos-a" ';
                            }else if(token.pos.startsWith('B')){
                                before += 'pos-b" ';
                            }else if (token.pos.startsWith('E')) {
                                before += 'pos-e" ';
                            } else if (token.pos.startsWith('N') || token.pos.startsWith('W')) {
                                before += 'pos-nw" ';
                            } else if (token.pos.startsWith('D') || token.pos == 'CD') {
                                before += 'pos-dcd" ';
                            } else if (token.pos.startsWith('S')) {
                                before += 'pos-s" ';
                            }else if (token.pos.startsWith('CC')) {
                                before += 'pos-cc" ';
                            } else if (token.pos.startsWith('I')) {
                                before += 'pos-ilsfw" ';
                            }else if (token.pos.startsWith('P')) {
                                before += 'pos-p" ';
                            } else if (token.pos == 'LS' || token.pos == 'FW') {
                                before += 'pos-ilsfw" ';
                            }else if (token.pos.startsWith('F')){
                                before += 'pos-f" ';
                            }else {
                                before += 'pos" ';
                            } 
                                    
                            before += 'data-content="<span class=';
                            
                            if (token.pos.startsWith('R')) {
                                before += 'pos-r';
                                color = 'color_r';
                            } else if (token.pos.startsWith('V') || token.pos.startsWith('M')) {
                                before += 'pos-vm';
                                color = 'color_v';
                            } else if (token.pos.startsWith('A')) {
                                before += 'pos-a';
                                color = 'color_a';
                            }else if (token.pos.startsWith('B')) {
                                before += 'pos-b';
                                color = 'color_b';
                            } else if (token.pos.startsWith('E')) {
                                before += 'pos-e';
                                color = 'color_e';
                            } else if (token.pos.startsWith('N') || token.pos.startsWith('W')) {
                                before += 'pos-nw';
                                color = 'color_n';
                            } else if (token.pos.startsWith('D') || token.pos == 'CD') {
                                before += 'pos-dcd';
                                color = 'color_d';
                            } else if (token.pos.startsWith('S')) {
                                before += 'pos-s';
                                color = 'color_s';
                            }else if (token.pos.startsWith('P')) {
                                    before += 'pos-p';
                                    color = 'color_p';
                            } else if (token.pos.startsWith('CC')){
                                before += 'pos-cc';
                                color = 'color_cc';
                            } else if (token.pos.startsWith('I')) {
                                before += 'pos-ilsfw';
                            } else if (token.pos == 'LS' || token.pos == 'FW') {
                                before += 'pos-ilsfw';
                                color = 'color_b';
                            }else if (token.pos.startsWith('F')){
                                before += 'pos-f';
                                color = 'color_f';
                            }else {
                                before += 'pos';
                                color = 'color_x';
                            }

                            before += '>'+token.pos +' : ';

                            switch (token.pos) {
                                case "A":
                                    before += 'Adjective';
                                    break;
                                case "B":
                                    before += 'Adverb';
                                    break;
                                case "BN":
                                        before += 'Adverb';
                                        break;
                                case "CC":
                                    before += 'Conjunction';
                                    break;
                                case "DQ":
                                    before += 'Adj. (det.)';
                                    break;
                                case "DI":
                                        before += 'Adj. (det.)';
                                        break;
                                case "E":
                                    before += 'Preposition';
                                    break;
                                case "E+RD":
                                    before += 'Preposition';
                                    break;
                                case "F":
                                    before += 'Punctuation';
                                    break;
                                case "N":
                                    before += 'Number';
                                    break;
                                case "P":
                                    before += 'Pronoun';
                                    break;
                                case "R":
                                    before += 'Determiner';
                                    break;
                                case "RI":
                                    before += 'Determiner';
                                    break;
                                case "RD":
                                    before += 'Determiner';
                                    break;
                                case "S":
                                    before += 'Noun';
                                    break;
                                case "X":
                                    before += 'Other';
                                    break;
                                case "V":
                                    before += 'Verb';
                                    break;
                                default:
                                    before += 'Other';
                                    break;
                            }

                            before += '</span><br><br>';
                                    
                            if (token.simplifiedVersion !== undefined || token.linking !== undefined || data.readability.forms[token.characterOffsetBegin] !== undefined) {
                                var pos=token.characterOffsetBegin;
                                
                                // Definitions
                                if(data.readability.forms[pos] !== undefined){
                                    if(data.readability.forms[pos].start === token.characterOffsetBegin && data.readability.forms[pos].end === token.characterOffsetEnd)
                                    {
                                        before += '<span class='+color+'><b>Definition</b></span> : '+ data.readability.forms[pos].description.description.replace('"', "'") + '<br>';
                                    }
                                }
                                // Links
                                if(token.linking !== undefined){
                                    page = token.linking.page;
                                    page = page.replace(/\.dbpedia\./gi, ".wikipedia.");
                                    page = page.replace(/\/dbpedia\./gi, "/en.wikipedia.");
                                    page = page.replace(/\/resource\//gi, "/wiki/");
                                    page = encodeURI(page);

                                    before += '<span class='+color+'><b>Wikipedia link</b></span> : <a href='+page+' class=target=_blank>'+ page + '</a><br>';
                                }
                                // Lexical simplifications
                                if(token.simplifiedVersion !== undefined){
                                    before += '<span class='+color+'><b>Lexical simplifications</b></span> : '+ token.simplifiedVersion.replace('"', "'") + '<br>' ;
                                }
                            }
                            
                            before += '<span class='+color+'><b>Lemma</b></span> : '+token.lemma+'<br>';

                            if(token.pos.includes("V")){

                                $.each(item.verbs, function (j, verb) {
                                    
                                    if(verb.tokens.includes(index) &&  verb.tokens[0] === index){

                                        before += '<span class='+color+'><b>Features</b></span> : <br>- '+ token.featuresText + ' <br>- ' + token.selected_morpho + '</em><br>';
    
                                        before +='<span class='+color+'><b>isPassive</b></span> : '+verb.isPassive+'<br>';
                                        before +='<span class='+color+'><b>Mood</b></span> : '+verb.mood+'<br>';
                                        if(verb.person != undefined){
                                            before +='<span class=color_v><b>Person</b></span> : '+verb.person+'<br>';
                                        }
                                                
                                        if(verb.tense != undefined){
                                            before +='<span class=color_v><b>Tense</b></span> : '+verb.tense+'<br>';
                                        }
                                        
                                    }
                                })

                            }else{
                                before +='<span class='+color+'><b>Features</b></span> : '+ token.featuresText;
                            }

                            if(token.derivation != undefined){
                                before += '<br><span class='+color+'><b>Derivation</b></span> : <ul><li>'+ token.derivation.baseLemma + ' - <em>' + token.derivation.baseType + '</em></li>';
                                token.derivation.phases.forEach(function (phase) {
                                    before += '<li>'+phase.affix + ' - <em>' + phase.type + '</em></li>';
                                });

                                before += '</ul>';
                            }else{
                                before +='<br>';
                            }

                            before +='<span class='+color+'><b>Hyphenation</b></span> : '+token.hyphenation+'<br><br>';
                            var color;
                                    
                            if(token.difficultyLevel == undefined || token.difficultyLevel == 4){
                                color = "red";
                            }else{
                                switch (token.difficultyLevel) {
                                    case 1:
                                        color = "blue";
                                        break;
                                    case 2:
                                        color = "green";
                                        break;
                                    case 3:
                                        color = "orange";
                                        break;
                                }
                            }

                            if(token.difficultyLevel == undefined){
                                before += '<span class=badge-tag-'+color+'> Difficulty level: 4</span>';
                            }else{
                                before += '<span class=badge-tag-'+color+'> Difficulty level: '+token.difficultyLevel+'</span>';
                            }
                   
                            if(token.literalWord){
                                before += '<span class=badge-tag-'+color+'>Literal word</span>';
                            }
                            if(token.contentWord){
                                before += '<span class=badge-tag-'+color+'>Content word</span>';
                            }
                            if(token.easyWord != undefined && token.easyWord){
                                before += '<span class=badge-tag-'+color+'>Easy word</span>';
                            }
                            if(token.guessed_lemma){
                                before += '<span class=badge-tag-'+color+'>Guessed lemma</span>';
                            }
                            before += '">';
                            after = '</span>';

                        }/*else if (token.pos.includes("V")){
                            $.each(item.verbs, function (j, verb) {
                                if(verb.tokens.includes(index) &&  verb.tokens[0] === index){
                                    var firstIndex = verb.tokens[0];
                                    var lastIndex = verb.tokens[verb.tokens.length-1];
                                    $.each(item.tokens, function (j, token) {
                                        if(token.index === firstIndex){
                                            start =  token.characterOffsetBegin - item.characterOffsetBegin;
                                        }else if(token.index === lastIndex){
                                            end = token.characterOffsetEnd - item.characterOffsetBegin;
                                        }
                                    });

                                    before = '<span tabindex="0" data-html="true" data-toggle="popover" role="button" title="Detailed information" class="word_hover my-popover label label-default pos-vm"';
                                    before += 'data-content="<span class=pos-vm> V: Verb</span><br><br>';
                                    before +='<span class=color_v><b>isPassive</b></span> : '+verb.isPassive+'<br>';
                                    before +='<span class=color_v><b>Mood</b></span> : '+verb.mood+'<br>';
                                    if(verb.person != undefined){
                                        before +='<span class=color_v><b>Person</b></span> : '+verb.person+'<br>';
                                    }
                                            
                                    if(verb.tense != undefined){
                                        before +='<span class=color_v><b>Tense</b></span> : '+verb.tense+'<br>';
                                    }
                                    before += '">';
                                    after = '</span>';
                                }
                            })
                        }*/
 
                        var newText = simpText.substring(0, start);
                        newText += before;
                        newText += simpText.substring(start, end);
                        newText += after;
                        newText += simpText.substring(end);
                        simpText = newText;

                        if (!token.contentWord) {
                            return;
                        }
                        contentWords++;
                        if (token.easyWord) {
                            easyWords++;
                        }
                        // minus 1
                        if (token.difficultyLevel == 1) {
                            levels[0]++;
                            levels[1]++;
                            levels[2]++;
                        }
                        if (token.difficultyLevel == 2) {
                            levels[1]++;
                            levels[2]++;
                        }
                        if (token.difficultyLevel == 3) {
                            levels[2]++;
                        }
                    });

                    var values = [];
                    var tooltips = [];
                    var v, c, l, t;

                    v = item.literalWords;
                    l = "Length";
                    if (item.literalWords > 25) {
                        c = "danger";
                        t = "The sentence is <b>too long</b>, it is advisable to break it";
                    }else {
                        c = "success";
                        t = "The length of the sentence is <b>adequate</b>";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    v = 100.0 * levels[0] / easyWords;
                    l = "Level 1";
                    if (v < gaugeLevelsOptions.yellowFrom) {
                        c = "danger";
                        t = "The basic vocabulary of the Italian language is <b>almost absent</b> from this period";
                    }else if (v > gaugeLevelsOptions.yellowTo) {
                        c = "success";
                        t = "The lexicon of this period is <b>too simple</b>";
                    }else {
                        c = "warning";
                        t = "The lexicon of this period contains <b>many words of the basic vocabulary</b>";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    v = 100.0 * levels[1] / contentWords;
                    l = "Level 2";
                    if (v < gaugeLevelsOptions.yellowFrom) {
                        c = "danger";
                        t = "The high-frequency vocabulary of the Italian language is <b>almost absent</b> from this period, it is advisable to simplify some words";
                    }else if (v > gaugeLevelsOptions.yellowTo) {
                        c = "success";
                        t = "The lexicon of this period is <b>quite simple</b>";
                    }else{
                        c = "warning";
                        t= "The lexicon of this period contains <b>many words of the high frequency vocabulary</b>";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    v = 100.0 * levels[2] / contentWords;
                    l = "Level 3";
                    if (v < gaugeLevelsOptions.yellowFrom) {
                        c = "danger";
                        t = "In this period the words are <b>all very complicated</b>, it is recommended to simplify them";
                    }else if (v > gaugeLevelsOptions.yellowTo) {
                        c = "success";
                        t = "The lexicon of this period mainly contains <b>words among the five thousand most frequent in the Italian language</b>";
                    }else {
                        c = "warning";
                        t = "The lexicon of this period contains <b>many words among the five thousand most frequent in the Italian language</b>";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    v = item.verbs.length;
                    l = "Sentences";
                    if (v < data.readability.minYellowValues.propositionsAvg) {
                        c = "success";
                        t = "The period contains <b>few sentences</b>, so it is very well understood";
                    }else if (v > data.readability.maxYellowValues.propositionsAvg) {
                        c = "danger";
                        t = "The period contains <b>too many sentences</b>, it is advisable to break it";
                    }else {
                        c = "warning";
                        t = "The sentence contains <b>several sentences</b>, so it may be difficult to understand";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    v = 1.0 * item.contentWords / item.literalWords;
                    l = "Lexical density";
                    if (v < data.readability.minYellowValues.density) {
                        c = "success";
                        t = "The relationship between meaningful words and functional words is <b>adequate</b>";
                    }else if (v > data.readability.maxYellowValues.density) {
                        c = "danger";
                        t = "The relationship between meaningful words and functional words is <b>unbalanced</b>, it is advisable to decrease the use of nouns / verbs / adjectives / adverbs";
                    } else{
                        c = "warning";
                        t = "The relationship between meaningful words and functional words is <b>adequate</b>";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    v = 1.0 * item.literalWords / item.verbs.length;
                    l = "Words per sentence";
                    if (v < data.readability.minYellowValues.wordsAvg) {
                        c = "success";
                        t = "The number of words per sentence is <b>adequate</b>";
                    }else if (v > data.readability.maxYellowValues.wordsAvg) {
                        c = "danger";
                        t = "The number of words per sentence is <b>too high</b>, it is advisable to remove unnecessary terms or to break the period";
                    }else {
                        c = "warning";
                        t = "The number of words per sentence is <b>quite high</b>, try to remove unnecessary terms";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    v = item.depth;
                    l = "Syntactic depth";
                    if (v < data.readability.minYellowValues.deepAvg) {
                        c = "success";
                        t = "The depth of the parse tree is <b>adequate</b>";
                    }else if (v > data.readability.maxYellowValues.deepAvg) {
                        c = "danger";
                        t = "The depth of the parse tree is <b>too high</b>, it is advisable to break the sentence and simplify its structure";
                    }else {
                        c = "warning";
                        t = "The depth of the parse tree is <b>a bit high</b>, it might be useful to break the sentence and simplify its structure";
                    }
                    values.push({l: l, v: v, c: c, t: t});
                    var row = $("<div></div>");
                    row.addClass("row");
                    row.addClass("row-sentence");
                    
                    var ids = 0;
                    values.forEach(function (value) {
                        var inside = $("<div></div>");
                        inside.addClass("col-md-3 col-5");
                        var v = Math.round(value.v * 100) / 100;
                        var c = value.c;
                        if (isNaN(v)) {
                            v = 100;
                            c = "success";
                        }
                        inside.append(value.l + ': <span class="badge badge-' + c + '">' + v + '</span>');
                        var thisId = "row-sentence-" + i + "-" + ++ids;
                        inside.attr("id", thisId);
                        tooltips.push({id: "#" + thisId, text: value.t, class: "info-" + value.c});
                        row.append(inside);
                    });

                    p.append(simpText);
                    p.append(row);
                    p.attr("id", "sentence" + i);
                    p.addClass("sentence");
                    $("#infoText").append(p);

                    tooltips.forEach(function (value) {
                        $(value.id).tooltip({
                            template: "<div class='tooltip' role='tooltip'><div class='tooltip-inner "+value.class+"'></div></div>",
                            html: true,
                            title: value.text});
                    })
                });

                /*$("#part2").tooltip({
                    selector: ".my-tool",
                    placement: 'right'
                });*/
                $("#part2").popover({
                    selector: ".my-popover",
                    trigger: "focus"
                    //trigger: "click"
                });

                // Gauges

                var mainValue = data.readability.measures.main;
                var mainName = data.readability.labels.main;
                
                var level1 = (isNaN(data.readability.measures.level1) ? 0 : data.readability.measures.level1);
                var level2 = (isNaN(data.readability.measures.level2) ? 0 : data.readability.measures.level2);
                var level3 = (isNaN(data.readability.measures.level3) ? 0 : data.readability.measures.level3);

                var gulpeaseChart = new google.visualization.Gauge(document.getElementById('gauge-slot-gulpease'));
                gulpeaseChart.draw(google.visualization.arrayToDataTable([
                    ['Label', 'Value'],
                    [mainName, mainValue]
                ]), gaugeOptions);
                var level1Chart = new google.visualization.Gauge(document.getElementById('gauge-slot-1'));
                level1Chart.draw(google.visualization.arrayToDataTable([
                    ['Label', 'Value'],
                    ['Level1', level1]
                ]), gaugeLevelsOptions);
                var level2Chart = new google.visualization.Gauge(document.getElementById('gauge-slot-2'));
                level2Chart.draw(google.visualization.arrayToDataTable([
                    ['Label', 'Value'],
                    ['Level2', level2]
                ]), gaugeLevelsOptions);
                var level3Chart = new google.visualization.Gauge(document.getElementById('gauge-slot-3'));
                level3Chart.draw(google.visualization.arrayToDataTable([
                    ['Label', 'Value'],
                    ['Level3', level3]
                ]), gaugeLevelsOptions);

                var t = "", c = "";
                var v;
                /*var div;*/

                v = mainValue;
                if (v < gaugeLevelsOptions.yellowFrom) {
                    c = "danger";
                    //t = "La sintassi di questo testo è complessa (comprensibile da un utente che abbia una scolarizzazione pari o superiore al diploma), si consiglia di semplificarla";
                    t = "<b>The syntax of this text is complex (understandable by a user who has a schooling equal to or greater than a diploma), it is advisable to simplify it</b>";
                }
                else if (v > gaugeLevelsOptions.yellowTo) {
                    c = "success";
                    //t = "La sintassi di questo testo è semplice, adatta anche a un utente con licenza elementare";
                    t = "<b>The syntax of this text is very simple, suitable even for a user with an elementary license</b>";
                }
                else {
                    c = "warning";
                    //t = "La sintassi di questo testo è piuttosto semplice, comprensibile da un utente con licenza media o superiore";
                    t = "<b>The syntax of this text is quite simple, understandable by a user with medium or higher license</b>";
                }

                $("#gauge-gulpease .gauge-description").tooltip({
                    template: "<div class='tooltip' role='tooltip'><div class='tooltip-inner info-"+c+"'></div></div>",
                    html: true,
                    title: '<em>The gulpease is a readability index for the Italian language. It does not take into consideration the content of the text, but technical information such as the length of sentences and words: <br> - less than 80 means difficult for a person at elementary school; <br> - less than 60 means difficult for a person at medium school; <br> - less than 40 means difficult for a person at high school.</em><br><br>' + t 
                })

                v = level1;
                if (v < gaugeLevelsOptions.yellowFrom) {
                    c = "danger";
                    //t = "Il vocabolario di base della lingua italiana è quasi assente da questo testo";
                    t = "<b>The basic vocabulary of the Italian language is almost absent from this text</b>";
                }
                else if (v > gaugeLevelsOptions.yellowTo) {
                    c = "success";
                    //t = "Il lessico di questo testo è estremamente semplice";
                    t = "<b>The lexicon of this text is extremely simple</b>";
                }
                else {
                    c = "warning";
                    //t = "Il lessico di questo testo contiene molte parole del vocabolario di base";
                    t = "<b>The lexicon of this text contains many words from the basic vocabulary</b>";
                }

                $("#gauge-level1 .gauge-description").tooltip({
                    template: "<div class='tooltip' role='tooltip'><div class='tooltip-inner info-"+c+"'></div></div>",
                    html: true,
                    title: '<em>The Level1 gauge shows how difficult the text is for a user knowing only the 500 easiest words in Italian (elementary school).</em><br><br>' + t 
                })

                v = level2;
                if (v < gaugeLevelsOptions.yellowFrom) {
                    c = "danger";
                    //t = "Il vocabolario di alta frequenza della lingua italiana è praticamente assente da questo testo, si consiglia di semplificare alcuni termini";
                    t = "<b>The high-frequency vocabulary of the Italian language is practically absent from this text, it is advisable to simplify some terms</b>";
                }
                else if (v > gaugeLevelsOptions.yellowTo) {
                    c = "success";
                    //t = "Il lessico di questo testo è piuttosto semplice";
                    t = "<b>The lexicon of this text is quite simple</b>";
                }
                else {
                    c = "warning";
                    //t = "Il lessico di questo testo contiene molte parole del vocabolario di alta frequenza";
                    t = "<b>The lexicon of this text contains many words from the high frequency vocabulary</b>";
                }

                $("#gauge-level2 .gauge-description").tooltip({
                    template: "<div class='tooltip' role='tooltip'><div class='tooltip-inner info-"+c+"'></div></div>",
                    html: true,
                    title: '<em>The Level2 gauge shows how difficult the text is for a user knowing only the 2500 easiest words in Italian (middle school).</em><br><br>'+t 
                })

                /*div = $("<div></div>");
                div.addClass("text-center " + c);*/

                //div.addClass("alert");
                //div.addClass("box");
                //div.addClass("alert-" + c);
                
                /*div.append(t);
                $("#gauge-level2 .gauge-description").append(div);*/

                v = level3;
                if (v < gaugeLevelsOptions.yellowFrom) {
                    c = "danger";
                    //t = "In questo testo le parole sono tutte molto complicate, si consiglia di semplificarle";
                    t = "<b>In this text the words are all very complicated, it is advisable to simplify them</b>";
                }
                else if (v > gaugeLevelsOptions.yellowTo) {
                    c = "success";
                    //t = "Il lessico di questo testo contiene prevalentemente parole tra le 5mila più frequenti della lingua italiana";
                    t = "<b>The lexicon of this text mainly contains words among the 5 thousand most frequent in the Italian language</b>";
                }
                else {
                    c = "warning";
                    //t = "Il lessico di questo testo contiene molte parole tra le 5mila più frequenti della lingua italiana";
                    t = "<b>The lexicon of this text contains many words among the 5 thousand most frequent in the Italian language</b>";
                }

                $("#gauge-level3 .gauge-description").tooltip({
                    template: "<div class='tooltip' role='tooltip'><div class='tooltip-inner info-"+c+"'></div></div>",
                    html: true,
                    title: '<em>The Level3 gauge shows how difficult the text is for a user knowing only the 5000 easiest words in Italian (high school).</em><br><br>' + t 
                })

                var row = $("<div></div>");
                row.addClass("row");
                row.addClass("justify-content-center");

                $.each(data.readability.minYellowValues, function (key) {
                    var name = key;
                    var myValue = data.readability[name];
                    var v = myValue;
                    var description = "";
                    switch (name) {
                        case "propositionsAvg":
                            description = "Average number of sentences for each period";
                            if (v < data.readability.minYellowValues.propositionsAvg) {
                                c = "success";
                                t = "The number of sentences per period is adequate";
                            }else if (v > data.readability.maxYellowValues.propositionsAvg) {
                                c = "danger";
                                t = "There are many sentences for each period, it is recommended to break some of them";
                            }else {
                                c = "warning";
                                t = "The average number of sentences per period is quite high, so it may be difficult to understand";
                            }
                            break;
                        case "subordinateRatio":
                            description = "Relationship between subordinate and coordinated propositions";
                            if (v < data.readability.minYellowValues.subordinateRatio) {
                                c = "success";
                                t = "The subordinate/coordinate relationship is adequate";
                            }else if (v > data.readability.maxYellowValues.subordinateRatio) {
                                c = "danger";
                                t = "There are too many subordinate clauses, it is advisable to remove some, perhaps by breaking some periods";
                            }else {
                                c = "warning";
                                t = "The subordinate/coordinate relationship is adequate, although it is advisable to remove some of them to make the text more readable";
                            }
                            break;
                        case "ttrValue":
                            description = "Semantic richness";
                            if (v < data.readability.minYellowValues.ttrValue) {
                                c = "success";
                                //t = "Il testo contiene poca variabilità semantica, quindi risulta comprensibile";
                                t = "The text contains little semantic variability, so it is understandable";
                            }else if (v > data.readability.maxYellowValues.ttrValue) {
                                c = "danger";
                                //t = "Il testo è semanticamente troppo ricco, si consiglia di usare termini meno variegati";
                                t = "The text is semantically too rich, it is advisable to use less varied terms";
                            }else {
                                c = "warning";
                                //t = "Il testo è piuttosto vario semanticamente, può risultare di difficile comprensione";
                                t = "The text is quite varied semantically, it can be difficult to understand";
                            }
                            break;
                        case "density":
                            description = "Lexical density";
                            if (v < data.readability.minYellowValues.density) {
                                c = "success";
                                //t = "Il rapporto tra parole portatrici di significato e parole funzionali è adeguato";
                                t = "The relationship between meaningful words and functional words is adequate";
                            }else if (v > data.readability.maxYellowValues.density) {
                                c = "danger";
                                //t = "Il rapporto tra parole di significato e parole funzionali è sbilanciato, si consiglia di aumentare l'uso di nomi/verbi/aggettivi/avverbi";
                                t = "The relationship between meaning words and functional words is unbalanced, it is recommended to increase the use of nouns/verbs/adjectives/adverbs";
                            }else {
                                c = "warning";
                                //t = "Il rapporto tra parole portatrici di significato e parole funzionali è adeguato";
                                t = "The relationship between meaningful words and functional words is adequate";
                            }
                            break;
                        case "wordsAvg":
                            description = "Number of words per sentence";
                            if (v < data.readability.minYellowValues.wordsAvg) {
                                c = "success";
                                //t = "Il numero di parole per frase è adeguato";
                                t = "The number of words per sentence is adequate";
                            }else if (v > data.readability.maxYellowValues.wordsAvg) {
                                c = "danger";
                                //t = "Il numero di parole per frase è troppo alto, si consiglia di togliere termini non necessari o a spezzare i periodi più lunghi";
                                t = "The number of words per sentence is too high, it is advisable to remove unnecessary terms or to break longer periods";
                            }else {
                                c = "warning";
                                //t = "Il numero di parole per frase è abbastanza elevato, provare a togliere termini non necessari";
                                t = "The number of words per sentence is quite high, try to remove unnecessary terms";
                            }
                            break;
                        case "deepAvg":
                            description = "Average depth of the parse tree";
                            if (v < data.readability.minYellowValues.deepAvg) {
                                c = "success";
                                //t = "La profondità media dell'albero sintattico è adeguata";
                                t = "The average depth of the parse tree is adequate";
                            }else if (v > data.readability.maxYellowValues.deepAvg) {
                                c = "danger";
                                //t = "La profondità media dell'albero sintattico è troppo alta, si consiglia di spezzare la frase e semplificarne la struttura";
                                t = "The average depth of the parse tree is too high, it is advisable to break the sentence and simplify its structure";
                            }else {
                                c = "warning";
                                //t = "La profondità media dell'albero sintattico è un po' alta, potrebbe essere utile spezzare la frase e semplificarne la struttura";
                                t = "The average depth of the parse tree is a bit high, it may be useful to break the sentence and simplify its structure";
                            }
                            break;
                    }

                    var divName = key + "-gauge";
                    /*var row = $("<div></div>");
                    row.addClass("row justify-content-center");
                    row.append(x"<div class='col-md-2' id='" + divName + "'>");
                    row.append("<div class='col-md-8' id='" + divName + "-desc'><p class='title'></p><p class='suggestion'></p>");*/

                    row.append("<div class='space col-lg-4 col-md-2 col-sm-4 col-4 d-flex justify-content-around' id='" + divName + "'>");
                    //row.append("<div class='col-md-3  d-flex justify-content-between align-items-center' id='" + divName + "-desc'><small><strong><p class='suggestion'></p></strong></small>");

                    $("#difficulty-values-panel ").append(row);
                    //$("#difficulty-values-panel .panel-body #" + divName + "-desc .title").append(description);

                    //$("#difficulty-values-panel .panel-body #" + divName + "-desc .suggestion").append(t);
                    //$("#difficulty-values-panel .panel-body #" + divName + "-desc .suggestion").addClass("alert");
                    //$("#difficulty-values-panel .panel-body #" + divName + "-desc .suggestion").addClass("alert-" + c);

                    $("#"+divName).tooltip({
                        template: "<div class='tooltip' role='tooltip'><div class='tooltip-inner info-"+c+"'></div></div>",
                        html: true,
                        title: '<b>' + description + '</b><br><span class="text">' + t + '</span>'
                    })

                    var myChart = new google.visualization.Gauge(document.getElementById(divName));
                    var min = data.readability.minValues[name];
                    var max = data.readability.maxValues[name];
                    var tick = (max - min) / 20.0;

                    var minor = data.readability.minYellowValues[name];
                    var maior = data.readability.maxYellowValues[name];

                    var greenFrom = min;
                    var greenTo = minor;
                    var yellowFrom = minor;
                    var yellowTo = maior;
                    var redFrom = maior;
                    var redTo = max;
                    if (maior < minor) {
                        redFrom = min;
                        redTo = maior;
                        yellowFrom = maior;
                        yellowTo = minor;
                        greenFrom = minor;
                        greenTo = max;
                    }

                    myGaugeOptions = {
                        redFrom: redFrom,
                        redTo: redTo,
                        yellowFrom: yellowFrom,
                        yellowTo: yellowTo,
                        greenFrom: greenFrom,
                        greenTo: greenTo,
                        minorTicks: tick,
                        min: min,
                        max: max,
                        width: 90,
                        height: 90
                    };

                    myChart.draw(google.visualization.arrayToDataTable([
                        ['Label', 'Value'],
                        [name, myValue]
                    ]), myGaugeOptions);

                });

                // Statistics

                $("#statistics1").append("<li class='list-group-item d-flex justify-content-between align-items-center'>"+"Sentences"+"<span class='badge badge-info badge-pill'>"+data.readability.sentenceCount+"</span></li>");
                $("#statistics1").append("<li class='list-group-item d-flex justify-content-between align-items-center'>"+"Tokens"+"<span class='badge badge-info badge-pill'>"+data.readability.tokenCount+"</span></li>");
                $("#statistics2").append("<li class='list-group-item d-flex justify-content-between align-items-center'>"+"Words"+"<span class='badge badge-info badge-pill'>"+data.readability.wordCount+"</span></li>");
                $("#statistics2").append("<li class='list-group-item d-flex justify-content-between align-items-center'>"+"Content words"+"<span class='badge badge-info badge-pill'>"+data.readability.contentWordSize+"</span></li>");

                //$("#legenda").append("<div class='col-lg-2 col-md-3 col-sm-3 col-10'><div class='panel panel-warning'><div class='panel-body'><p class='font-weight-bold text-muted size' style='margin-left: 23px;'>Legenda</p><ul class='legenda'><li><span class='a'>A</span> : Adjective</li><li><span class='b'>B</span> : Adverb</li><li><span class='s'>C</span> : Conjunction</li><li><span class='d'>D</span> : Adj. (det.)</li><li><span class='e'>E</span> : Preposition</li><li><span class='f'>F</span> : Punctuation</li><li><span class='n'>N</span> : Number</li><li><span class='f'>P</span> : Pronoun</li><li><span class='r'>R</span> : Determiner</li><li><span class='s'>S</span> : Noun</li><li><span class='v'>V</span> : Verb</li><li><span class='b'>X</span> : Other</li></ul></div></div></div>");
                    
                // Pos chart

                /*var posData = new google.visualization.DataTable();
                posData.addColumn("string", "POS tag");
                posData.addColumn("number", "Count");
                $.each(data.readability.genericPosDescription, function (key, value) {
                    var num = data.readability.genericPosStats.support[key];
                    posData.addRow([value, num]);
                });*/

                // Stanford stuff
                $.each(data.sentences, function (i, item) {
                    $.each(item.tokens.reverse(), function () {});  
                });

                if (typeof data == undefined || data.sentences == undefined) {
                    alert("Failed to reach server!");
                }else{
                    // Re-render divs
                    function createAnnotationDiv(id, annotator, selector, label) {
                        // (make sure we requested that element)
                        if (annotators().indexOf(annotator) < 0) {
                            return;
                        }
                        // (make sure the data contains that element)
                        ok = false
                        if (typeof data[selector] != 'undefined') {
                            ok = true;
                        } else if (typeof data.sentences != 'undefined' && data.sentences.length > 0) {
                            if (typeof data.sentences[0][selector] != 'undefined') {
                                ok = true;
                            } else if (typeof data.sentences[0].tokens != 'undefined' && data.sentences[0].tokens.length > 0) {
                                ok = (typeof data.sentences[0].tokens[0][selector] != 'undefined');
                            }
                        }
                        // (render the element)
                        if (ok) {
                            $('#annotations').append('<h6>' + label + ':</h6> <div id="' + id + '"></div><br>');
                        }
                    }
                    // (create the divs)
                    //                  div id      annotator     field_in_data                          label
                    createAnnotationDiv('pos', 'pos', 'pos', 'Part-of-Speech');
                    //createAnnotationDiv('lemma',    'lemma',      'lemma',                               'Lemmas'                  );
                    createAnnotationDiv('ner', 'ner', 'ner', 'Named Entity Recognition');
                    createAnnotationDiv('deps', 'depparse', 'basic-dependencies', 'Basic Dependencies');
                    // createAnnotationDiv('deps2',    'depparse',   'enhanced-plus-plus-dependencies',     'Enhanced++ Dependencies' );
                    // createAnnotationDiv('openie',   'openie',     'openie',                              'Open IE'                 );
                    // createAnnotationDiv('coref',    'coref',      'corefs',                              'Coreference'             );
                    // createAnnotationDiv('entities', 'entitylink', 'entitylink',                          'Wikidict Entities'       );
                    // createAnnotationDiv('kbp',      'kbp',        'kbp',                                 'KBP Relations'           );
                    // createAnnotationDiv('sentiment','sentiment',  'sentiment',                           'Sentiment'               );

                    // Render
                    render(data);
                }

                $("#part2").show();
                    
                // Load switchery
                var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
                elems.forEach(function (html) {
                    var switchery = new Switchery(html, {size: "small"});
                });
            }
        });
        return false;
    });
});
