/**
 * Class to hold and parse sections lists
 * @author Davide Testolin
 */

class SectionsList {

    /**
     * Constructor method
     * @param {String[]} list 
     * @param {String[]} completeList
     */
    constructor(list, completeList) {
        this._list = list;
        this._completeList = completeList;
    }

    /**
     * Check if a section is contained in the list
     * @param {String} section 
     * @return {boolean}
     */
    includes(section) {
        return this._list.includes(section);
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
        // Check if array are identical
        if (list === completeList) {
            parsedList = list;
        } else {
            // Check if both arrays are empty
            if (completeList.length < 0) throw new Error('Complete list is empty!');
            if (list.length < 0) throw new Error('Complete list is empty!');

            // Check if in the list array there is the tag ALL
            let indexAll = list.indexOf('@a');
            if (indexAll !== -1) {
                // Remove tag from list array
                list.splice(indexAll, 1);
                // Set final array to contains all sections
                parsedList = completeList;
            } else {
                // Check for every grade if tag is present in the list array
                let found = [];
                for (let i = 1; i <= 5; i++) {
                    let index = list.indexOf('@' + i);
                    if (index !== -1 && !found.includes(i)) {
                        // Remove tag from list array
                        list.splice(index, 1);
                        // Save tag to prevent recursion
                        found.push(i);
                        // Concat sections to final array
                        parsedList = parsedList.concat(
                            completeList.filter(section => section[0] === String(i))
                        );
                    }
                }
            }

            // Concat to final list sections prensets in the original array
            parsedList = parsedList.concat(list);

            // First filter sections to remove (es "3IC")
            let exclude1 = list.filter(section => section[0] === '-');
            // Second filter section removed (es "-3IC")
            let exclude2 = exclude1.map(section => section.substr(1));
            // Filter final list with sections to remove
            parsedList = parsedList.filter(section => !exclude1.includes(section) && !exclude2.includes(section));
        }
        // Return final array
        return new SectionsList(parsedList, completeList);
    }

    /**
     * Minify a list
     * @return {String[]}
     */
    minify() {
        let finalList = [];
        // TODO: finish this method
        return finalList;
    }
}

export default SectionsList;