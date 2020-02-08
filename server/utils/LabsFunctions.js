"use strict";
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const Assembly = require('../models/Assembly');
const Laboratory = require('../models/Laboratory');
const Subscribed = require('../models/Subscribed');
const SectionsList = require("./SectionsList");

/**
 * Get all avabile labs for a specific given section
 * @param {String} section
 * @private
 */
const fetchAvabileLabs = async section => {
	const results = await Assembly.find();
	// Use first assembly ignoring the others actives
	let assembly = results[0].toObject();
	let labs = await Laboratory.find();
	// TODO: Optimize that ugly thing --->
	let promiseArray = [];
	labs = labs
		.map(lab => {
			for (let i = 0; i < assembly.tot_h; i++) {
				lab.info[i].sections = SectionsList.parse(
					lab.info[i].sections,
					assembly.sections
				).getList();
            }
            return lab;
		})
		.filter(lab => {
			for (let i = 0; i < assembly.tot_h; i++) {
				if (lab.info[i].sections.includes(section)) {
					return true;
				}
            }
			return false;
        });
        
    labs.forEach(lab => {
        for (let i = 0; i < assembly.tot_h; i++) {
            promiseArray.push(
                Subscribed.countDocuments({ ["labs." + i]: ObjectId(lab._id) })
            );
        }
    });
    // <---
    
	const countResults = await Promise.all(promiseArray);
	labs = labs.map((lab, index) => {
		for (let i = 0; i < assembly.tot_h; i++) {
			lab.info[i].seats -= countResults[index * assembly.tot_h + i];
		}
		return lab;
    });
    
	return labs;
};

module.exports = {
    fetchAvabileLabs
};