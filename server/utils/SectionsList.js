"use strict";

class SectionsList {

    /**
     * Constructor method
     * @param {String[]} list 
     */
    constructor(list) {
        this._list = list;
    }

    /**
     * Check if a section is contained in the list
     * @param {String} section 
     * @return {boolean}
     */
    contains(section) {
        return this._list.contains(section);
    }

    /**
     * Get the list
     * @return {String[]}
     */
    getList() {
        return this._list;
    }

    /**
     * Parse a list
     * @param {String[]} list 
     * @param {String[]} completeList 
     * @return {SectionsList}
     * @see SectionsList
     */
    static parse(list, completeList) {
        let parsedList = [];
        if (list === completeList) {
            parsedList = list;
        } else {
            if (list.length > 0 && completeList.length > 0) {
                switch (list[0]) {
                    case '@1':
                        parsedList = completeList.filter(section => section[0] === 1);
                        break;
                    case '@2':
                        parsedList = completeList.filter(section => section[0] === 2);
                        break;
                    case '@3':
                        parsedList = completeList.filter(section => section[0] === 3);
                        break;
                    case '@4':
                        parsedList = completeList.filter(section => section[0] === 4);
                        break;
                    case '@5':
                        parsedList = completeList.filter(section => section[0] === 5);
                        break;
                    case '@a':
                    default:
                        parsedList = completeList;
                        break;
                }
                let exclude = list.filter(section => section[0] === '-');
                parsedList = parsedList.filter(section => !exclude.includes(section));
            }
        }
        return new SectionsList(parsedList);
    }
}

module.exports = SectionsList;