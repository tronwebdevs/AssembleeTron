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
		// Create new array variable to prevent from changing original array
		let wList = JSON.parse(JSON.stringify(list));
		let parsedList = [];
		// Check if arrays are identical
		if (wList === completeList) {
			parsedList = wList;
		} else {
			// Check if both arrays are empty
			if (completeList.length < 0)
				throw new Error('Complete list is empty!');
			if (wList.length < 0) throw new Error('Complete list is empty!');

			// Check if in the list array there is the tag ALL
			let indexAll = wList.indexOf('@a');
			if (indexAll !== -1) {
				// Remove tag from list array
				wList.splice(indexAll, 1);
				// Set final array to contains all sections
				parsedList = completeList;
			} else {
				// Check for every grade if tag is present in the list array
				let found = [];
				for (let i = 1; i <= 5; i++) {
					let index = wList.indexOf('@' + i);
					if (index !== -1 && !found.includes(i)) {
						// Remove tag from list array
						wList.splice(index, 1);
						// Save tag to prevent recursion
						found.push(i);
						// Concat sections to final array
						parsedList = parsedList.concat(
							completeList.filter(
								section => section[0] === String(i)
							)
						);
					}
				}
			}

			// Concat to final list sections prensets in the original array
			parsedList = parsedList.concat(wList);

			// First filter sections to remove (es "3IC")
			let exclude1 = wList.filter(section => section[0] === '-');
			// Second filter section removed (es "-3IC")
			let exclude2 = exclude1.map(section => section.substr(1));
			// Filter final wList with sections to remove
			parsedList = parsedList.filter(
				section =>
					!exclude1.includes(section) && !exclude2.includes(section)
			);
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
		// Check if both arrays are empty
		if (this._completeList.length < 0) return finalList;
		if (this._list.length < 0) return finalList;

		// Check if array are identical
		if (
			this._list.length === this._completeList.length &&
			this._list.every(
				(value, index) => value === this._completeList[index]
			)
		) {
			// Arrays are identical, return ALL tag
			finalList = ['@a'];
		} else if (this._list.length >= this._completeList.length - 5) {
			let diff = this._completeList
				.filter(section => !this._list.includes(section))
				.map(section => '-' + section);
			// Arrays are very similar, but not identical
			finalList.push('@a', ...diff);
		} else {
			// Arrays are different
			for (let i = 1; i <= 5; i++) {
				let gradeSections = [];
				let totGradeSections = [];
				// Filter sections of grade "i" in all sections array
				totGradeSections = this._completeList.filter(
					section => section[0] === String(i)
				);

				// Filter sections of grade "i" in list sections array
				gradeSections = this._list.filter(
					section => section[0] === String(i)
				);

				// Check if array are identical
				if (
					gradeSections.length === totGradeSections.length &&
					gradeSections.every(
						(value, index) => value === totGradeSections[index]
					)
				) {
					// Arrays are identical, return ALL tag for specific grade
					finalList.push('@' + i);
				} else {
					if (gradeSections.length > totGradeSections.length / 2) {
						let diff = totGradeSections
							.filter(section => !gradeSections.includes(section))
							.map(section => '-' + section);
						finalList.push('@' + i, ...diff);
					} else {
						finalList.push(...gradeSections);
					}
				}
			}
		}
		finalList = finalList.sort().reverse();
		return finalList;
	}
}

export default SectionsList;
