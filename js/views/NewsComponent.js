/*Global Variables*/
let view;
let service;
let current_page_number = 1;
const MAX_NEWS_PER_PAGE = 5;
/*--------------------------------------------------------------------------------------------------------------------*/
/*Default class*/
function NewsComponent(service) {
    current_component = 'News';
    this.service = service;
    // this.table = this.get('table-NewsID');
    this.page_blocks = split(this.service.db, MAX_NEWS_PER_PAGE);
    this.block_auto = $('#autoBox');
    this.block_nav = $('#navigation');
    this.block_main = $('#main');
    this.block_switch = $('#switcher');
    this.htmlSaver = {
        auto: this.block_auto.innerHTML,
        nav: this.block_nav.innerHTML,
        main: this.block_main.innerHTML,
        switcher: this.block_switch.innerHTML,
    };
}
/*--------------------------------------------------------------------------------------------------------------------*/
NewsComponent.prototype.addNewsRow =function (news) {
    let row = this.table.insertRow();
    row.insertCell().innerHTML =news.date;
    row.insertCell().innerHTML =news.title;
};
NewsComponent.prototype.printNewsList = function (max = this.service.size()) {
    for (let i = 0; i < max; i++) {
        this.addNewsRow(this.service.get(i));
    }
};
/*--------------------------------------------------------------------------------------------------------------------*/
NewsComponent.prototype.fillAutoBox = function() {
    this.block_auto.innerHTML = this.htmlSaver.auto;
    for(let news of this.service.db) {
        if(news.images.length > 0) {
            let chosen = Math.floor(Math.random() * news.images.length);
            this.block_auto.appendChild(buildDIV([
                buildIMG(news.images[chosen], '', cls('autoBox-image' ,[
                    {name:'onclick', value:'location.href=\'#' + news.id + '\''},
                    {name:'onmouseover', value:'pauseABI()'},
                    {name:'onmouseleave', value:'resumeABI()'},
                ])),
                buildDIV([
                    buildDIV(news.title, cls('autoBox-title')),
                    buildDIV([
                        textShortener(news.description, 150),
                        buildElement('button', 'More', cls('autoBox-more', [
                            {name:'onclick', value:'location.href=\'#' + news.id + '\''}
                        ])),
                    ], cls('autoBox-content'))
                ], cls('autoBox-text')),
            ], cls('autoBox-item')));
        }
    }
    this.block_auto.appendChild(buildSPAN('<', cls( 'previous-auto_item',[
        {name:'onclick', value:'previousABI()'},
        {name:'onmouseover', value:'pauseABI()'},
        {name:'onmouseleave', value:'resumeABI()'},
    ])));
    this.block_auto.appendChild(buildSPAN('>', cls( 'next-auto_item',[
        {name:'onclick', value:'nextABI()'},
        {name:'onmouseover', value:'pauseABI()'},
        {name:'onmouseleave', value:'resumeABI()'},
    ])));
};
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * Create navigation menu dynamically
 */
NewsComponent.prototype.fillNavigation = function () {
    this.block_nav.innerHTML = this.htmlSaver.nav;
    for(let news of this.page_blocks[current_page_number - 1]) {
        this.block_nav.appendChild(buildHR());
        this.block_nav.appendChild(buildDIV([
            buildLINK('#' + news.id, news.title, cls('menuitem'))
        ]));
    }
};
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * Create main block dynamically
 */
NewsComponent.prototype.fillMain = function () {
    this.block_main.innerHTML = this.htmlSaver.main;
    for(let news of this.page_blocks[current_page_number - 1]) {
        let titleDiv = buildDIV([
            buildDIV(news.title, cls('title')),
        ], id(news.id));
        let detailsDiv = buildDIV([
            buildElement('p', formattedDate(news.date), cls('date')),
            buildElement('p', news.description),
        ], cls('details'));
        let rowDiv = buildDIV(null, cls('row'));
        let columnSpan = buildSPAN(null, cls('column'));
        for(let image of news.images) {
            columnSpan.appendChild(buildIMG(image, 'MQL PLATFORM', id('id_' + image, [
                {name:'onclick', value:'popIMG(this.id)'}
            ])));
        }
        rowDiv.appendChild(columnSpan);
        detailsDiv.appendChild(rowDiv);
        titleDiv.appendChild(detailsDiv);
        this.block_main.appendChild(titleDiv);
    }
};
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * Create page switcher dynamically
 */
NewsComponent.prototype.fillSwitcher = function () {
    this.block_switch.innerHTML = this.htmlSaver.switcher;
    let pages = this.page_blocks.length;
    for(let i = 1; i<=pages; i++) {
        if(current_page_number === i){
            this.block_switch.appendChild(buildSPAN(i, cls('active-page', [
                {name:'onclick', value:'view.navigate(' + i + ', true)'},
            ])));
        }
        else {
            this.block_switch.appendChild(buildSPAN(i, wrap([
                {name:'onclick', value:'view.navigate(' + i + ', true)'},
            ])));
        }
    }
};
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * Navigate between pages
 * @param page_number
 * @param top
 */
NewsComponent.prototype.navigate = function(page_number=1, top=false) {
    current_page_number = page_number;
    this.fillNavigation();
    this.fillMain();
    this.fillSwitcher();
    addTitleIcon('resources/pictures/News/News-logo.png', true);
    detect_subContent_trigger_left_bar();
    if(top) window.location.href = '#main';
};
/*--------------------------------------------------------------------------------------------------------------------*/
NewsComponent.prototype.trigger = function () {
    let anchor = window.location.href.split('#')[1];
    if(anchor !== undefined && anchor !== 'header') {
        $('#nav' + anchor).click();
    }
};
/*--------------------------------------------------------------------------------------------------------------------*/
/**
 * Filtering function works with search box
 */
NewsComponent.prototype.filterKey = function () {
    let key = $('#key').value;
    if(key === '') {
        // LOAD ALL DATA
        this.page_blocks = split(this.service.db, MAX_NEWS_PER_PAGE);
    } else {
        // LOAD BY KEY
        this.page_blocks = split(this.service.searchByKey(key), MAX_NEWS_PER_PAGE);
        console.log(this.service.searchByKey(key));
    }
    if(this.page_blocks.length === 0) {
        $('.error-message')[0].innerHTML = 'News not Found !';
        $('#key').setAttribute('class', 'search-error');
        showEmptyErrorResult();
    } else {
        $('.error-message')[0].innerHTML = '';
        $('#key').setAttribute('class', 'search-input');
    }
    this.navigate();
};
/*--------------------------------------------------------------------------------------------------------------------*/
/* FORM SERVICES */
NewsComponent.prototype.addData = function() {
    $('#newsSubmit').setAttribute('onclick', 'view.submitData()');
    popFORM();
};
/*--------------------------------------------------------------------------------------------------------------------*/
NewsComponent.prototype.editData = function(index) {
    let el_title = $('#newsTitle');
    let el_desc = $('#newsDescription');
    //....
    let target = this.service.get(index);
    el_title.value = target.title;
    el_desc.value = target.description;
    //...
    $('#newsSubmit').setAttribute('onclick', 'view.submitData(\'edit\', ' + index + ')');
    popFORM();
};
/*--------------------------------------------------------------------------------------------------------------------*/
NewsComponent.prototype.deleteData = function(index) {
    if(confirm('Are you sure you want to delete this News ?')) {
        this.service.remove(index);
        //....
        try {
            this.page_blocks = split(this.service.db, MAX_NEWS_PER_PAGE);
            this.navigate();
        } catch (e) {
            if(confirm('None News is found! Add new one ?')) {
                view.addData();
            } else {
                route('../Home');
            }
        }
    }
};
/*--------------------------------------------------------------------------------------------------------------------*/
NewsComponent.prototype.submitData = function (action = 'add', index = '0') {
    // GETTING DATA MEMBERS
    let title = $('#newsTitle').value;
    let desc = $('#newsDescription').value;
    //...
    if(action === 'add') {
        this.service.add(new News(this.service.size() + 1, title, new Date(), desc));
    }
    if(action === 'edit') {
        let target = this.service.get(index);
        target.title = title;
        target.description = desc;
        //...
        $('#newsSubmit').setAttribute('onclick', 'view.submitData()');
    }
    this.service.sort();
    this.page_blocks = split(this.service.db, MAX_NEWS_PER_PAGE);
    closeFORM();
    this.navigate();
};
/*--------------------------------------------------------------------------------------------------------------------*/
NewsComponent.prototype.triggerSubmit = function () {
    let submit_element = $('#newsSubmit');
    submit_element.click();
};
/*--------------------------------------------------------------------------------------------------------------------*/
/**-------------------------------------------------------------------------------------------------------------------*/
/* Main Function */
function NewsMain() {
    service = new NewsComponentService();
    service.load(dbNews);
    view = new NewsComponent(service);
    try {
        view.fillAutoBox();
        view.fillNavigation();
        view.fillMain();
        view.fillSwitcher();
    } catch (e) {
        if(confirm('None News is found! Add new one ?')) {
            view.addData();
        } else {
            route('Home');
        }
    }
    // stays last
    autoBoxLoader();
    addTitleIcon('resources/pictures/News/News-logo.png', true);
    detect_subContent_trigger_left_bar();
    // view.trigger();
    setKeysAction('.form-content',view.triggerSubmit.bind(view));
}
/*--------------------------------------------------------------------------------------------------------------------*/
