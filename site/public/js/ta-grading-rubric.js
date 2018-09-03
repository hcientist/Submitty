/**
 *  Notes: Some variables have 'domElement' in their name, but they may be jquery objects
 */

/**
 * Global variables.  Add these very sparingly
 */

/**
 * An associative object of <component-id> : <mark[]>
 * Each 'mark' has at least properties 'id', 'points', 'title', which is sufficient
 *  to determine conflict resolutions.  These are updated when a component is opened.
 * @type {Object}
 */
OLD_MARK_LIST = {};

/**
 * A number ot represent the id of no component
 * @type {int}
 */
NO_COMPONENT_ID = -1;

/**
 * The id of the custom mark for a component
 * @type {int}
 */
CUSTOM_MARK_ID = 0;

/**
 * A counter to given unique, negative ids to new marks that haven't been
 *  added to the server yet
 * @type {int}
 */
MARK_ID_COUNTER = 0;

/**
 * True if components should open in edit mode
 * @type {boolean}
 */
EDIT_MODE_ENABLED = false;

/**
 * Count directions for components
 * @type {int}
 */
COUNT_DIRECTION_UP = 1;
COUNT_DIRECTION_DOWN = -1;

/**
 * Pdf Page settings for components
 * @type {int}
 */
PDF_PAGE_NONE = 0;
PDF_PAGE_STUDENT = -1;
PDF_PAGE_INSTRUCTOR = -2;

/**
 * Whether ajax requests will be asynchronous or synchronous.  This
 *  is used instead of passing an 'async' parameter to every function.
 * @type {boolean}
 */
AJAX_USE_ASYNC = true;

/**
 * Keep All of the ajax functions at the top of this file
 *
 */

/**
 * Called internally when an ajax function irrecoverably fails before rejecting
 * @param err
 */
function displayAjaxError(err) {
    console.error("Failed to parse response.  The server isn't playing nice...");
    console.error(err);
    // alert("There was an error communicating with the server. Please refresh the page and try again.");
}

/**
 * ajax call to fetch the gradeable's rubric
 * @param {string} gradeable_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxGetGradeableRubric(gradeable_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "GET",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'get_gradeable_rubric',
                'gradeable_id': gradeable_id
            }),
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong fetching the gradeable rubric: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to save the component
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {string} title
 * @param {string} ta_comment
 * @param {string} student_comment
 * @param {int} page
 * @param {number} lower_clamp
 * @param {number} default_value
 * @param {number} max_value
 * @param {number} upper_clamp
 * @returns {Promise}
 */
function ajaxSaveComponent(gradeable_id, component_id, title, ta_comment, student_comment, page, lower_clamp, default_value, max_value, upper_clamp) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'save_component'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'title': title,
                'ta_comment': ta_comment,
                'student_comment': student_comment,
                'page_number': page,
                'lower_clamp': lower_clamp,
                'default': default_value,
                'max_value': max_value,
                'upper_clamp': upper_clamp,
                'peer': false
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong saving the component: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to fetch the component's rubric
 * @param {string} gradeable_id
 * @param {int} component_id
 * @returns {Promise}
 */
function ajaxGetComponentRubric(gradeable_id, component_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "GET",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'get_component_rubric',
                'gradeable_id': gradeable_id,
                'component_id': component_id,
            }),
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong fetching the component rubric: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to get the entire graded gradeable for a user
 * @param {string} gradeable_id
 * @param {string} anon_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxGetGradedGradeable(gradeable_id, anon_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "GET",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'get_graded_gradeable',
                'gradeable_id': gradeable_id,
                'anon_id': anon_id
            }),
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong fetching the gradeable grade: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to fetch an updated Graded Component
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {string} anon_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxGetGradedComponent(gradeable_id, component_id, anon_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "GET",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'get_graded_component',
                'gradeable_id': gradeable_id,
                'anon_id': anon_id,
                'component_id': component_id
            }),
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong fetching the component grade: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    // null is not the same as undefined, so we need to make that conversion before resolving
                    if(response.data === null) {
                        response.data = undefined;
                    }
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to save the grading information for a component and submitter
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {string} anon_id
 * @param {int} graded_version
 * @param {number} custom_points
 * @param {string} custom_message
 * @param {boolean} silent_edit True to edit marks assigned without changing the grader
 * @param {int[]} mark_ids
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxSaveGradedComponent(gradeable_id, component_id, anon_id, graded_version, custom_points, custom_message, silent_edit, mark_ids) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'save_graded_component'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'anon_id': anon_id,
                'graded_version': graded_version,
                'custom_points': custom_points,
                'custom_message': custom_message,
                'silent_edit': silent_edit,
                'mark_ids': mark_ids
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong saving the component grade: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to fetch the overall comment for the gradeable
 * @param {string} gradeable_id
 * @param {string} anon_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxGetOverallComment(gradeable_id, anon_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'get_overall_comment'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'anon_id': anon_id
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong fetching the gradeable comment: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to save the general comment for the graded gradeable
 * @param {string} gradeable_id
 * @param {string} anon_id
 * @param {string} overall_comment
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxSaveOverallComment(gradeable_id, anon_id, overall_comment) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'save_overall_comment'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'anon_id': anon_id,
                'overall_comment': overall_comment
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong saving the overall comment: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to add a new mark to the component
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {string} title
 * @param {number} points
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxAddNewMark(gradeable_id, component_id, title, points) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'add_new_mark'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'title': title,
                'points': points
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong adding a new mark: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to delete a mark
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {int} mark_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxDeleteMark(gradeable_id, component_id, mark_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'delete_mark'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'mark_id': mark_id
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong deleting the mark: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to save mark point value / title
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {int} mark_id
 * @param {string} title
 * @param {number} points
 * @param {boolean} publish
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxSaveMark(gradeable_id, component_id, mark_id, title, points, publish) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'save_mark'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'mark_id': mark_id,
                'points': points,
                'title': title,
                'publish': publish
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong saving the mark: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to get the stats about a mark
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {int} mark_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxGetMarkStats(gradeable_id, component_id, mark_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'get_mark_stats'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'mark_id': mark_id
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong getting mark stats: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to update the order of marks in a component
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {*} order format: { <mark0-id> : <order0>, <mark1-id> : <order1>, ... }
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxSaveMarkOrder(gradeable_id, component_id, order) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'save_mark_order'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'order': JSON.stringify(order)
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong saving the mark order: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to update the pages of components in the gradeable
 * @param {string} gradeable_id
 * @param {*} pages format: { <component0-id> : <page0>, <component1-id> : <page1>, ... } OR { page } to set all
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxSaveComponentPages(gradeable_id, pages) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'save_component_pages'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'pages': JSON.stringify(pages)
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong saving the component pages: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to update the order of components in the gradeable
 * @param {string} gradeable_id
 * @param {*} order format: { <component0-id> : <order0>, <component1-id> : <order1>, ... }
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxSaveComponentOrder(gradeable_id, order) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'save_component_order'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'order': JSON.stringify(order)
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong saving the component order: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to add a generate component on the server
 * @param {string} gradeable_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxAddComponent(gradeable_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'add_component'
            }),
            data: {
                'gradeable_id': gradeable_id,
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong adding the component: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data)
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to delete a component from the server
 * @param {string} gradeable_id
 * @param {int} component_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxDeleteComponent(gradeable_id, component_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: AJAX_USE_ASYNC,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'delete_component'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id
            },
            success: function (response) {
                if (response.status !== 'success') {
                    console.error('Something went wrong deleting the component: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data);
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to verify the grader of a component
 * @param {string} gradeable_id
 * @param {int} component_id
 * @param {string} anon_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxVerifyComponent(gradeable_id, component_id, anon_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: true,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'verify_component'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'component_id': component_id,
                'anon_id': anon_id,
            },
            success: function (response) {
                if (response.status !== "success") {
                    console.error('Something went wrong verifying the component: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data);
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * ajax call to verify the grader of a component
 * @param {string} gradeable_id
 * @param {string} anon_id
 * @return {Promise} Rejects except when the response returns status 'success'
 */
function ajaxVerifyAllComponents(gradeable_id, anon_id) {
    return new Promise(function (resolve, reject) {
        $.getJSON({
            type: "POST",
            async: true,
            url: buildUrl({
                'component': 'grading',
                'page': 'electronic',
                'action': 'verify_all_components'
            }),
            data: {
                'gradeable_id': gradeable_id,
                'anon_id': anon_id,
            },
            success: function (response) {
                if (response.status !== "success") {
                    console.error('Something went wrong verifying the all components: ' + response.message);
                    reject(new Error(response.message));
                } else {
                    resolve(response.data);
                }
            },
            error: function (err) {
                displayAjaxError(err);
                reject(err);
            }
        });
    });
}

/**
 * Put all DOM accessing methods here to abstract the DOM from the other function
 *  of the interface
 */

/**
 * Gets the id of the open gradeable
 * @return {string}
 */
function getGradeableId() {
    return $('#gradeable-rubric').attr('data-gradeable_id');
}

/**
 * Gets the anon_id of the submitter being graded
 * @return {string}
 */
function getAnonId() {
    return $('#anon-id').attr('data-anon_id');
}

/**
 * Gets the id of the grader
 * @returns {*|void|jQuery}
 */
function getGraderId() {
    return $('#grader-info').attr('data-grader_id');
}

/**
 * Used to determine if the interface displayed is for
 *  instructor edit mode (i.e. in the Edit Gradeable page)
 *  @return {boolean}
 */
function isInstructorEditEnabled() {
    return $('#edit-gradeable-instructor-flag').length > 0;
}

/**
 * Used to determine if the 'verify grader' button should be displayed
 * @returns {boolean}
 */
function canVerifyGraders() {
    return $('#grader-info').attr('data-can_verify');
}

/**
 * Gets if grading is disabled since the selected version isn't the same
 *  as the one chosen for grading
 * @return {boolean}
 */
function isGradingDisabled() {
    return $('#version-conflict-indicator').length > 0;
}

/**
 * Gets the precision for component/mark point values
 * @returns {number}
 */
function getPointPrecision() {
    return parseFloat($('#point_precision_id').val());
}

/**
 * Used to determine if the mark list should be displayed in 'edit' mode
 *  @return {boolean}
 */
function isEditModeEnabled() {
    return EDIT_MODE_ENABLED || isInstructorEditEnabled();
}

/**
 * Updates the edit mode state.  This is used to the mode
 * does not change before the components close
 */
function updateEditModeEnabled() {
    // noinspection JSUndeclaredVariable
    EDIT_MODE_ENABLED = $('#edit-mode-enabled').is(':checked');
}

/**
 * Gets if silent edit mode is enabled
 * @return {boolean}
 */
function isSilentEditModeEnabled() {
    // noinspection JSValidateTypes
    return $('#silent-edit-id').is(':checked');
}

/**
 * Gets a unique mark id for adding new marks
 * @return {int}
 */
function getNewMarkId() {
    return MARK_ID_COUNTER--;
}

/**
 * Sets the DOM elements to render for the entire rubric
 * @param elements
 */
function setRubricDOMElements(elements) {
    let gradingBox = $("#grading-box");
    gradingBox.html(elements);

    if (isInstructorEditEnabled()) {
        setupSortableComponents();
    }
}

/**
 * Gets the component id of a DOM element inside a component
 * @param me DOM element
 * @return {int}
 */
function getComponentIdFromDOMElement(me) {
    if ($(me).hasClass('component')) {
        return parseInt($(me).attr('data-component_id'));
    }
    return parseInt($(me).parents('.component').attr('data-component_id'));
}

/**
 * Gets the mark id of a DOM element inside a mark
 * @param me DOM element
 * @return {int}
 */
function getMarkIdFromDOMElement(me) {
    if ($(me).hasClass('mark-container')) {
        return parseInt($(me).attr('data-mark_id'));
    }
    return parseInt($(me).parents('.mark-container').attr('data-mark_id'));
}

/**
 * Gets the JQuery selector for the component id
 * Note: This is not the component container
 * @param {int} component_id
 * @return {jQuery}
 */
function getComponentJQuery(component_id) {
    return $('#component-' + component_id);
}

/**
 * Gets the JQuery selector for the mark id
 * @param {int} mark_id
 * @return {jQuery}
 */
function getMarkJQuery(mark_id) {
    return $('#mark-' + mark_id);
}

/**
 * Gets the JQuery selector for the component's custom mark
 * @param {int} component_id
 * @return {jQuery}
 */
function getCustomMarkJQuery(component_id) {
    return getComponentJQuery(component_id).find('.custom-mark-container');
}

/**
 * Gets the JQuery selector for the overall comment container
 * @return {jQuery}
 */
function getOverallCommentJQuery() {
    return $('#overall-comment-container');
}

/**
 * Shows the 'in progress' indicator for a component
 * @param {int} component_id
 * @param {boolean} show
 */
function setComponentInProgress(component_id, show = true) {
    let domElement = getComponentJQuery(component_id);
    domElement.find('.save-tools span').hide();
    if (show) {
        domElement.find('.save-tools-in-progress').show();
    } else {
        domElement.find('.save-tools :not(.save-tools-in-progress)').show();
    }
}

/**
 * Shows the 'in progress' indicator for the overall comment
 * @param {boolean} show
 */
function setOverallCommentInProgress(show = true) {
    let domElement = getOverallCommentJQuery();
    domElement.find('.save-tools span').hide();
    if (show) {
        domElement.find('.save-tools-in-progress').show();
    } else {
        domElement.find('.save-tools :not(.save-tools-in-progress)').show();
    }
}

/**
 * Enables reordering on marks in an edit-mode component
 * @param {int} component_id
 */
function setupSortableMarks(component_id) {
    let markList = getComponentJQuery(component_id).find('.ta-rubric-table');
    markList.sortable({
        items: 'div:not(.mark-first,.add-new-mark-container)'
    });
    markList.keydown(keyPressHandler);
    markList.disableSelection();
}

/**
 * Enables reordering on components for instructor edit mode
 */
function setupSortableComponents() {
    let componentList = $('#component-list');
    componentList.sortable({
        update: onComponentOrderChange,
        handle: '.reorder-component-container'
    });
    componentList.keydown(keyPressHandler);
    componentList.disableSelection();
}

/**
 * Key press handler for jquery sortable elements
 * @param e
 */
function keyPressHandler(e) {
    // Enable ctrl-a to select all
    if (e.keyCode === 65 && e.ctrlKey) {
        e.target.select()
    }
}

/**
 * Sets the HTML contents of the overall comment container
 * @param {string} contents
 */
function setOverallCommentContents(contents) {
    getOverallCommentJQuery().html(contents);
}

/**
 * Sets the HTML contents of the specified component container
 * @param {int} component_id
 * @param {string} contents
 */
function setComponentContents(component_id, contents) {
    getComponentJQuery(component_id).parent('.component-container').html(contents);

    // Enable sorting for this component if in edit mode
    if(isEditModeEnabled()) {
        setupSortableMarks(component_id);
    }
}

/**
 * Sets the HTML contents of the specified component's header
 * @param {int} component_id
 * @param {string} contents
 */
function setComponentHeaderContents(component_id, contents) {
    getComponentJQuery(component_id).find('.header-block').html(contents);
}

/**
 * Sets the HTML contents of the total scores box
 * @param {string} contents
 */
function setTotalScoreBoxContents(contents) {
    $('#total-score-container').html(contents);
}

/**
 * Sets the HTML contents of the rubric total box (instructor edit mode)
 * @param contents
 */
function setRubricTotalBoxContents(contents) {
    $('#rubric-total-container').html(contents);
}

/**
 * Gets the count direction for a component in instructor edit mode
 * @param {int} component_id
 * @returns {int} COUNT_DIRECTION_UP or COUNT_DIRECTION_DOWN
 */
function getCountDirection(component_id) {
    if (getComponentJQuery(component_id).find('input.count-up-selector').is(':checked')) {
        return COUNT_DIRECTION_UP;
    } else {
        return COUNT_DIRECTION_DOWN;
    }
}

/**
 * Sets the title of a mark
 * Note: This only changes the text in the DOM, so it should be only called on open components
 * @param {int} mark_id
 * @param {string} title
 */
function setMarkTitle(mark_id, title) {
    getMarkJQuery(mark_id).find('.mark-title input').val(title);
}

/**
 * Loads all components from the DOM
 * @returns {Array}
 */
function getAllComponentsFromDOM() {
    let components = [];
    $('.component').each(function () {
        components.push(getComponentFromDOM(getComponentIdFromDOMElement(this)));
    });
    return components;
}

/**
 * Gets the page number assigned to a component
 * @param {int} component_id
 * @returns {int}
 */
function getComponentPageNumber(component_id) {
    let domElement = getComponentJQuery(component_id);
    if (isInstructorEditEnabled()) {
        return parseInt(domElement.find('input.page-number').val());
    } else {
        return parseInt(domElement.attr('data-page'));
    }
}

/**
 * Extracts a component object from the DOM
 * @param {int} component_id
 * @return {Object}
 */
function getComponentFromDOM(component_id) {
    let domElement = getComponentJQuery(component_id);

    if (isInstructorEditEnabled() && isComponentOpen(component_id)) {
        let penaltyPoints = Math.abs(parseFloat(domElement.find('input.penalty-points').val()));
        let maxValue = Math.abs(parseFloat(domElement.find('input.max-points').val()));
        let extraCreditPoints = Math.abs(parseFloat(domElement.find('input.extra-credit-points').val()));
        let countUp = getCountDirection(component_id) !== COUNT_DIRECTION_DOWN;

        return {
            id: component_id,
            title: domElement.find('input.component-title').val(),
            ta_comment: domElement.find('textarea.ta-comment').val(),
            student_comment: domElement.find('textarea.student-comment').val(),
            page: getComponentPageNumber(component_id),
            lower_clamp: -penaltyPoints,
            default: countUp ? 0.0 : maxValue,
            max_value: maxValue,
            upper_clamp: maxValue + extraCreditPoints,
            marks: getMarkListFromDOM(component_id)
        };
    }
    return {
        id: component_id,
        title: domElement.attr('data-title'),
        ta_comment: domElement.attr('data-ta_comment'),
        student_comment: domElement.attr('data-student_comment'),
        page: parseInt(domElement.attr('data-page')),
        lower_clamp: parseFloat(domElement.attr('data-lower_clamp')),
        default: parseFloat(domElement.attr('data-default')),
        max_value: parseFloat(domElement.attr('data-max_value')),
        upper_clamp: parseFloat(domElement.attr('data-upper_clamp')),
        marks: getMarkListFromDOM(component_id)
    };
}

/**
 * Extracts an array of marks from the DOM
 * @param {int} component_id
 * @return {Array}
 */
function getMarkListFromDOM(component_id) {
    let domElement = getComponentJQuery(component_id);
    let markList = [];
    let i = 0;
    domElement.find('.ta-rubric-table .mark-container').each(function () {
        let mark = getMarkFromDOM(parseInt($(this).attr('data-mark_id')));

        // Don't add the custom mark
        if(mark === null) {
            return;
        }
        mark.order = i;
        markList.push(mark);
        i++;
    });
    return markList;
}

/**
 * Extracts a mark from the DOM
 * @param {int} mark_id
 * @return {Object}
 */
function getMarkFromDOM(mark_id) {
    let domElement = getMarkJQuery(mark_id);
    if (isEditModeEnabled()) {
        return {
            id: parseInt(domElement.attr('data-mark_id')),
            points: parseFloat(domElement.find('input[type=number]').val()),
            title: domElement.find('input[type=text]').val(),
            deleted: domElement.hasClass('mark-deleted'),
            publish: domElement.find('.mark-publish input[type=checkbox]').is(':checked')
        };
    } else {
        if (mark_id === 0) {
            return null;
        }
        return {
            id: parseInt(domElement.attr('data-mark_id')),
            points: parseFloat(domElement.find('.mark-points').attr('data-points')),
            title: domElement.find('.mark-title').attr('data-title'),
            publish: domElement.attr('data-publish')
        };
    }
}

/**
 * Gets if a component exists for this gradeable
 * @param {int} component_id
 * @return {boolean}
 */
function componentExists(component_id) {
    return getComponentJQuery(component_id).length > 0;
}

/**
 * Extracts a graded component object from the DOM
 * @param {int} component_id
 * @return {Object}
 */
function getGradedComponentFromDOM(component_id) {
    let domElement = getComponentJQuery(component_id);
    let customMarkContainer = domElement.find('.custom-mark-container');

    // Get all of the marks that are 'selected'
    let mark_ids = [];
    let customMarkSelected = false;
    domElement.find('span.mark-selected').each(function () {
        let mark_id = parseInt($(this).attr('data-mark_id'));
        if (mark_id === CUSTOM_MARK_ID) {
            customMarkSelected = true;
        } else {
            mark_ids.push(mark_id);
        }
    });

    let score = 0.0;
    let comment = '';
    if (isEditModeEnabled()) {
        let customMarkDOMElement = domElement.find('.custom-mark-data');
        score = parseFloat(customMarkDOMElement.attr('data-score'));
        comment = customMarkDOMElement.attr('data-comment');
        customMarkSelected = customMarkDOMElement.attr('data-selected') === 'true'
    } else {
        score = parseFloat(customMarkContainer.find('input[type=number]').val());
        comment = customMarkContainer.find('textarea').val();
    }

    let dataDOMElement = domElement.find('.graded-component-data');
    return {
        score: score,
        comment: comment,
        custom_mark_selected: customMarkSelected,
        mark_ids: mark_ids,
        graded_version: parseInt(dataDOMElement.attr('data-graded_version')),
        grade_time: dataDOMElement.attr('data-grade_time'),
        grader_id: dataDOMElement.attr('data-grader_id'),
        verifier_id: dataDOMElement.attr('data-verifier_id')
    };
}

/**
 * Gets the scores data from the DOM (auto grading earned/possible and ta grading possible)
 * @return {Object}
 */
function getScoresFromDOM() {
    let dataDOMElement = $('#gradeable-scores-id');

    // Get the TA grading scores
    let scores = {
        ta_grading_earned: getTaGradingEarned(),
        ta_grading_total: getTaGradingTotal()
    };

    // Then check if auto grading scorse exist before adding them
    let autoGradingTotal = dataDOMElement.attr('data-auto_grading_total');
    if (autoGradingTotal !== '') {
        scores.auto_grading_earned = parseInt(dataDOMElement.attr('data-auto_grading_earned'));
        scores.auto_grading_total = parseInt(autoGradingTotal);
    }

    return scores;
}

/**
 * Gets the rubric total / extra credit from the DOM
 * @return {Object}
 */
function getRubricTotalFromDOM() {
    let total = 0;
    let extra_credit = 0;
    getAllComponentsFromDOM().forEach(function (component) {
        total += component.max_value;
        extra_credit += component.upper_clamp - component.max_value;
    });
    return {
        total: total,
        extra_credit: extra_credit
    };
}

/**
 * Gets the number of ta grading points the student has been awarded
 * @return {number|undefined} Undefined if no score data exists
 */
function getTaGradingEarned() {
    let total = 0.0;
    let anyPoints = false;
    $('.graded-component-data').each(function () {
        let pointsEarned = $(this).attr('data-total_score');
        if (pointsEarned === '') {
            return;
        }
        total += parseFloat(pointsEarned);
        anyPoints = true;
    });
    if (!anyPoints) {
        return undefined;
    }
    return total;
}

/**
 * Gets the number of ta grading points that can be earned
 * @return {number}
 */
function getTaGradingTotal() {
    let total = 0.0;
    $('.component').each(function () {
        total += parseFloat($(this).attr('data-max_value'));
    });
    return total;
}

/**
 * Gets the overall comment message stored in the DOM
 * @return {string} This will always be blank in instructor edit mode
 */
function getOverallCommentFromDOM() {
    let staticComment = $('span#overall-comment');
    let editComment = $('textarea#overall-comment');

    if (editComment.length > 0) {
        return editComment.val();
    } else if (editComment.length > 0) {
        return staticComment.html();
    }
    return '';
}

/**
 * Gets the ids of all open components
 * @return {Array}
 */
function getOpenComponentIds() {
    let component_ids = [];
    $('.ta-rubric-table:visible').each(function () {
        component_ids.push($(this).attr('data-component_id'));
    });
    return component_ids;
}

/**
 * Gets the component id from its order on the page
 * @param {int} order
 * @return {int}
 */
function getComponentIdByOrder(order) {
    return $('.component-container').eq(order).find('.component').attr('data-component_id');
}

/**
 * Gets the orders of the components indexed by component id
 * @return {Object}
 */
function getComponentOrders() {
    let orders = {};
    $('.component').each(function(order) {
        let id = getComponentIdFromDOMElement(this);
        orders[id] = order;
    });
    return orders;
}

/**
 * Gets the id of the next component in the list
 * @param {int} component_id
 * @return {int}
 */
function getNextComponentId(component_id) {
    return getComponentJQuery(component_id).parent('.component-container').next().children('.component').attr('data-component_id');
}

/**
 * Gets the id of the previous component in the list
 * @param {int} component_id
 * @return {int}
 */
function getPrevComponentId(component_id) {
    return getComponentJQuery(component_id).parent('.component-container').prev().children('.component').attr('data-component_id');
}

/**
 * Gets the first open component on the page
 * @return {int}
 */
function getFirstOpenComponentId() {
    let component_ids = getOpenComponentIds();
    if (component_ids.length === 0) {
        return NO_COMPONENT_ID;
    }
    return component_ids[0];
}

/**
 * Gets the number of components on the page
 * @return {int}
 */
function getComponentCount() {
    // noinspection JSValidateTypes
    return $('.component-container').length;
}

/**
 * Gets the mark id for a component and order
 * @param {int} component_id
 * @param {int} mark_order
 * @returns {int} Mark id or 0 if out of bounds
 */
function getMarkIdFromOrder(component_id, mark_order) {
    let jquery = getComponentJQuery(component_id).find('.mark-container');
    if(mark_order < jquery.length) {
        return parseInt(jquery.eq(mark_order).attr('data-mark_id'));
    }
    return 0;
}

/**
 * Gets the id of the open component from the cookie
 * @return {int} Returns zero of no open component exists
 */
function getOpenComponentIdFromCookie() {
    let component_id = document.cookie.replace(/(?:(?:^|.*;\s*)open_component_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    component_id = parseInt(component_id);
    if(isNaN(component_id)) {
        return NO_COMPONENT_ID;
    }
    return component_id;
}

/**
 * Updates the open component in the cookie
 */
function updateCookieComponent() {
    document.cookie = "open_component_id=" + getFirstOpenComponentId() + "; path=/;";
}

/**
 * Gets the id of the no credit / full credit mark of a component
 * @param {int} component_id
 * @return {int}
 */
function getComponentFirstMarkId(component_id) {
    return parseInt(getComponentJQuery(component_id).find('.mark-container').first().attr('data-mark_id'));
}

/**
 * Gets if a component is open
 * @param {int} component_id
 * @return {boolean}
 */
function isComponentOpen(component_id) {
    return !getComponentJQuery(component_id).find('.ta-rubric-table').is(':hidden');
}

/**
 * Gets if the overall comment is open
 * @return {boolean}
 */
function isOverallCommentOpen() {
    return $('textarea#overall-comment').length > 0;
}

/**
 * Gets if a mark is 'checked'
 * @param {int} mark_id
 * @return {boolean}
 */
function isMarkChecked(mark_id) {
    return getMarkJQuery(mark_id).find('span.mark-selected').length > 0;
}

/**
 * Gets if a mark is disabled (shouldn't be checked
 * @param {int} mark_id
 * @returns {boolean}
 */
function isMarkDisabled(mark_id) {
    return getMarkJQuery(mark_id).hasClass('mark-disabled');
}

/**
 * Gets if a mark was marked for deletion
 * @param {int} mark_id
 * @return {boolean}
 */
function isMarkDeleted(mark_id) {
    return getMarkJQuery(mark_id).hasClass('mark-deleted');
}

/**
 * Gets if the state of the custom mark is such that it should appear checked
 * Note: if the component is in edit mode, this will never return true
 * @param {int} component_id
 * @return {boolean}
 */
function hasCustomMark(component_id) {
    if (isEditModeEnabled()) {
        return false;
    }
    let gradedComponent = getGradedComponentFromDOM(component_id);
    return gradedComponent.comment !== '';
}

/**
 * Gets if the custom mark on a component is 'checked'
 * @param {int} component_id
 * @return {boolean}
 */
function isCustomMarkChecked(component_id) {
    return getCustomMarkJQuery(component_id).find('.mark-selected').length > 0;
}

/**
 * Checks the custom mark checkbox
 * @param {int} component_id
 */
function checkDOMCustomMark(component_id) {
    getCustomMarkJQuery(component_id).find('.mark-selector').addClass('mark-selected');
}

/**
 * Un-checks the custom mark checkbox
 * @param {int} component_id
 */
function unCheckDOMCustomMark(component_id) {
    getCustomMarkJQuery(component_id).find('.mark-selector').removeClass('mark-selected');
}

/**
 * Toggles the state of the custom mark checkbox in the DOM
 * @param {int} component_id
 */
function toggleDOMCustomMark(component_id) {
    getCustomMarkJQuery(component_id).find('.mark-selector').toggleClass('mark-selected');
}

/**
 * Opens the 'users who got mark' dialog
 * @param {string} component_title
 * @param {string} mark_title
 * @param {int} gradedComponentCount
 * @param {int} totalComponentCount
 * @param {Array} submitterIds
 */
function openMarkStatsPopup(component_title, mark_title, gradedComponentCount, totalComponentCount, submitterIds) {
    let popup = $('#student-marklist-popup');

    popup.find('.question-title').html(component_title);
    popup.find('.mark-title').html(mark_title);
    popup.find('.submitter-count').html(submitterIds.length);
    popup.find('.graded-component-count').html(gradedComponentCount);
    popup.find('.total-component-count').html(totalComponentCount);

    // Create an array of links for each submitter
    let submitterHtmlElements = [];
    submitterIds.forEach(function (id) {
        let href = window.location.href.replace(/&who_id=([a-z0-9_]*)/, '&who_id=' + id);
        submitterHtmlElements.push('<a href="' + href + '">' + id + '</a>');
    });
    popup.find('.student-names').html(submitterHtmlElements.join(', '));

    // Hide all other (potentially) open popups
    $('.popup-form').hide();

    // Open the popup
    popup.show();
}

/**
 * Gets if there are any loaded unverified components
 * @returns {boolean}
 */
function anyUnverifiedComponents() {
    return $('.verify-container').length > 0;
}

/**
 * Hides the verify all button if there are no components to verify
 */
function updateVerifyAllButton() {
    if (!anyUnverifiedComponents()) {
        $('#verify-all').hide();
    } else {
        $('#verify-all').show();
    }
}


/**
 * DOM Callback methods
 *
 */

/**
 * Called when the 'add new mark' div gets pressed
 * @param me DOM element of the 'add new mark' div
 */
function onAddNewMark(me) {
    addNewMark(getComponentIdFromDOMElement(me))
        .catch(function (err) {
            console.error(err);
            alert('Error adding mark! ' + err.message);
        });
}

/**
 * Called when a mark is marked for deletion
 * @param me DOM Element of the delete button
 */
function onDeleteMark(me) {
    $(me).parents('.mark-container').toggleClass('mark-deleted');
}

/**
 * Called when a mark marked for deletion gets restored
 * @param me DOM Element of the restore button
 */
function onRestoreMark(me) {
    $(me).parents('.mark-container').toggleClass('mark-deleted');
}

/**
 * Called when a component is deleted
 * @param me DOM Element of the delete button
 */
function onDeleteComponent(me) {
    if (!confirm('Are you sure you want to delete this component?')) {
        return;
    }
    deleteComponent(getComponentIdFromDOMElement(me))
        .catch(function (err) {
            console.error(err);
            alert('Failed to delete component! ' + err.message);
        })
        .then(function () {
            return reloadInstructorEditRubric(getGradeableId());
        })
        .catch(function (err) {
            alert('Failed to reload rubric! ' + err.message);
        });
}

/**
 * Called when the 'add new component' button is pressed
 */
function onAddComponent() {
    addComponent()
        .catch(function(err) {
            console.error(err);
            alert('Failed to add component! ' + err.message);
        })
        .then(function () {
            return reloadInstructorEditRubric(getGradeableId());
        })
        .catch(function (err) {
            alert('Failed to reload rubric! ' + err.message);
        });
}

/**
 * Called when the point value of a common mark changes
 * @param me DOM Element of the mark point entry
 */
function onMarkPointsChange(me) {
    refreshComponentHeader(getComponentIdFromDOMElement(me), true)
        .catch(function (err) {
            console.error(err);
            alert('Error updating component! ' + err.message);
        });
}

/**
 * Called when the mark stats button is pressed
 * @param me DOM Element of the mark stats button
 */
function onGetMarkStats(me) {
    let component_id = getComponentIdFromDOMElement(me);
    let mark_id = getMarkIdFromDOMElement(me);
    ajaxGetMarkStats(getGradeableId(), component_id, mark_id)
        .then(function (stats) {
            let component_title = getComponentFromDOM(component_id).title;
            let mark_title = getMarkFromDOM(mark_id).title;

            // TODO: this is too much math in the view.  Make the server do this
            let graded = 0, total = 0;
            for (let sectionNumber in stats.sections) {
                if (stats.sections.hasOwnProperty(sectionNumber)) {
                    graded += parseInt(stats.sections[sectionNumber]['graded_components']);
                    total += parseInt(stats.sections[sectionNumber]['total_components']);
                }
            }

            openMarkStatsPopup(component_title, mark_title, graded, total, stats.submitter_ids);
        })
        .catch(function (err) {
            alert('Failed to get stats for mark: ' + err.message);
        });
}

/**
 * Called when a component gets clicked (for opening / closing)
 * @param me DOM Element of the component header div
 */
function onClickComponent(me) {
    let component_id = getComponentIdFromDOMElement(me);
    toggleComponent(component_id, true)
        .catch(function (err) {
            console.error(err);
            setComponentInProgress(component_id, false);
            alert('Error opening/closing component! ' + err.message);
        });
}

/**
 * Called when the 'cancel' button is pressed on an open component
 * @param me DOM Element of the cancel button
 */
function onCancelComponent(me) {
    toggleComponent(getComponentIdFromDOMElement(me), false)
        .catch(function (err) {
            console.error(err);
            alert('Error closing component! ' + err.message);
        });
}

/**
 * Called when the overall comment box get clicked (for opening / closing)
 * @param me DOM Element of the overall comment box
 */
function onClickOverallComment(me) {
    toggleOverallComment(true)
        .catch(function (err) {
            console.error(err);
            alert('Error opening/closing overall comment! ' + err.message);
        });
}

/**
 * When the component order changes, update the server
 */
function onComponentOrderChange() {
    ajaxSaveComponentOrder(getGradeableId(), getComponentOrders())
        .catch(function (err) {
            console.error(err);
            alert('Error reordering components! ' + err.message);
        });
}

/**
 * Called when the 'cancel' button is pressed on the overall comment box
 * @param me DOM element of the cancel button
 */
function onCancelOverallComment(me) {
    toggleOverallComment(false)
        .catch(function (err) {
            console.error(err);
            alert('Error closing overall comment! ' + err.message);
        });
}

/**
 * Called when a mark is clicked in grade mode
 * @param me DOM Element of the mark div
 */
function onToggleMark(me) {
    toggleCommonMark(getComponentIdFromDOMElement(me), getMarkIdFromDOMElement(me))
        .catch(function (err) {
            console.error(err);
            alert('Error toggling mark! ' + err.message);
        });
}

/**
 * Called when one of the custom mark fields changes
 * @param me DOM Element of one of the custom mark's elements
 */
function onCustomMarkChange(me) {
    updateCustomMark(getComponentIdFromDOMElement(me))
        .catch(function (err) {
            console.error(err);
            alert('Error updating custom mark! ' + err.message);
        });
}

/**
 * Toggles the 'checked' state of the custom mark.  This effectively
 *  makes the 'score' and 'comment' values 0 and '' respectively when
 *  loading the graded component from the DOM, but leaves the values in
 *  the DOM if the user toggles this again.
 * @param me
 */
function onToggleCustomMark(me) {
    let component_id = getComponentIdFromDOMElement(me);
    toggleDOMCustomMark(component_id);
    toggleCustomMark(component_id)
        .catch(function (err) {
            console.error(err);
            alert('Error toggling custom mark! ' + err.message);
        });
}

/**
 * Callback for the 'verify' buttons
 * @param me DOM Element of the verify button
 */
function onVerifyComponent(me) {
    verifyComponent(getComponentIdFromDOMElement(me))
        .catch(function (err) {
            console.error(err);
            alert('Error verifying component! ' + err.message);
        });
}

/**
 * Callback for the 'verify all' button
 * @param me DOM Element of the verify all button
 */
function onVerifyAll(me) {
    verifyAllComponents()
        .catch(function (err) {
            console.error(err);
            alert('Error verifying all components! ' + err.message);
        });
}

/**
 * Callback for the 'edit mode' checkbox changing states
 * @param me DOM Element of the checkbox
 */
function onToggleEditMode(me) {
    // Get the open components so we know which one to open once they're all saved
    let open_component_ids = getOpenComponentIds();
    let reopen_component_id = NO_COMPONENT_ID;
    if (open_component_ids.length !== 0) {
        reopen_component_id = open_component_ids[0];
    }

    closeAllComponents(true)
        .catch(function (err) {
            console.error(err);
            alert('Error closing component! ' + err.message);
        })
        .then(function () {
            // Only update edit mode once the open components are all closed
            updateEditModeEnabled();
            if (reopen_component_id !== NO_COMPONENT_ID) {
                return openComponent(reopen_component_id);
            }
        })
        .catch(function (err) {
            console.error(err);
            alert('Error re-opening component! ' + err.message);
        });
}

/**
 * Callback for the 'count up' option of a component in instructor edit mode
 * @param me DOM element of the 'count up' radio button
 */
function onClickCountUp(me) {
    let component_id = getComponentIdFromDOMElement(me);
    let mark_id = getComponentFirstMarkId(component_id);
    setMarkTitle(mark_id, 'No Credit');
}

/**
 * Callback for the 'count down' option of a component in instructor edit mode
 * @param me DOM element of the 'count down' radio button
 */
function onClickCountDown(me) {
    let component_id = getComponentIdFromDOMElement(me);
    let mark_id = getComponentFirstMarkId(component_id);
    setMarkTitle(mark_id, 'Full Credit');
}

/**
 * Callback for changing on the point values for a component
 * @param me DOM element of the input box
 */
function onComponentPointsChange(me) {
    refreshInstructorEditComponentHeader(getComponentIdFromDOMElement(me), true)
        .catch(function (err) {
            console.error(err);
            alert('Failed to refresh component! ' + err.message);
        });
}

/**
 * Callback for changing the title for a component
 * @param me DOM element of the input box
 */
function onComponentTitleChange(me) {
    getComponentJQuery(getComponentIdFromDOMElement(me)).find('.component-title-text').text($(me).val());
}

/**
 * Callback for changing the page number for a component
 * @param me DOM element of the input box
 */
function onComponentPageNumberChange(me) {
    getComponentJQuery(getComponentIdFromDOMElement(me)).find('.component-page-number-text').text($(me).val());
}

/**
 * Put all of the primary logic of the TA grading rubric here
 *
 */


/**
 * Verifies a component with the grader and reloads the component
 * @param {int} component_id
 * @returns {Promise}
 */
function verifyComponent(component_id) {
    let gradeable_id = getGradeableId();
    return ajaxVerifyComponent(gradeable_id, component_id, getAnonId())
        .then(function () {
            return reloadGradingComponent(component_id);
        })
        .then(function () {
            updateVerifyAllButton();
        });
}

/**
 * Verifies all graded components and reloads the rubric
 * @returns {Promise}
 */
function verifyAllComponents() {
    let gradeable_id = getGradeableId();
    let anon_id = getAnonId();
    return ajaxVerifyAllComponents(gradeable_id, anon_id)
        .then(function () {
            return reloadGradingRubric(gradeable_id, anon_id);
        })
        .then(function () {
            updateVerifyAllButton();
        });
}

/**
 * Adds a blank component to the gradeable
 * @return {Promise}
 */
function addComponent() {
    return ajaxAddComponent(getGradeableId());
}

/**
 * Deletes a component from the server
 * @param {int} component_id
 * @returns {Promise}
 */
function deleteComponent(component_id) {
    return ajaxDeleteComponent(getGradeableId(), component_id);
}

/**
 * Sets the gradeable-wide page setting
 * @param {int} page PDF_PAGE_INSTRUCTOR, PDF_PAGE_STUDENT, or PDF_PAGE_NONE
 * @return {Promise}
 */
function setPdfPageAssignment(page) {
    if (page === PDF_PAGE_INSTRUCTOR) {
        page = 1;
    }

    return closeAllComponents(true)
        .then(function () {
            return ajaxSaveComponentPages(getGradeableId(), {'page': page});
        })
        .then(function () {
            // Reload the gradeable to refresh all the component's display
            return reloadInstructorEditRubric(getGradeableId());
        });
}

/**
 * Searches a array of marks for a mark with an id
 * @param {Object[]} marks
 * @param {int} mark_id
 * @return {Object}
 */
function getMarkFromMarkArray(marks, mark_id) {
    for (let i = 0; i < marks.length; ++i) {
        if (marks[i].id === mark_id) {
            return marks[i];
        }
    }
    return null;
}

/**
 * Call this once on page load to load the rubric for grading a submitter
 * Note: This takes 'gradeable_id' and 'anon_id' parameters since it gets called
 *  in the 'RubricPanel.twig' server template
 * @param {string} gradeable_id
 * @param {string} anon_id
 * @return {Promise}
 */
function reloadGradingRubric(gradeable_id, anon_id) {
    let gradeable_tmp = null;
    return ajaxGetGradeableRubric(gradeable_id)
        .catch(function (err) {
            alert('Could not fetch gradeable rubric: ' + err.message);
        })
        .then(function (gradeable) {
            gradeable_tmp = gradeable;
            return ajaxGetGradedGradeable(gradeable_id, anon_id);
        })
        .catch(function (err) {
            alert('Could not fetch graded gradeable: ' + err.message);
        })
        .then(function (graded_gradeable) {
            return renderGradingGradeable(getGraderId(), gradeable_tmp, graded_gradeable, isGradingDisabled(), canVerifyGraders());
        })
        .then(function (elements) {
            setRubricDOMElements(elements);
            return openCookieComponent();
        })
        .catch(function (err) {
            alert("Could not render gradeable: " + err.message);
            console.error(err);
        });
}

/**
 * Call this once on page load to load the rubric instructor editing
 * @param {string} gradeable_id
 * @return {Promise}
 */
function reloadInstructorEditRubric(gradeable_id) {
    return ajaxGetGradeableRubric(gradeable_id)
        .catch(function (err) {
            alert('Could not fetch gradeable rubric: ' + err.message);
        })
        .then(function (gradeable) {
            return renderInstructorEditGradeable(gradeable);
        })
        .then(function (elements) {
            setRubricDOMElements(elements);
            return refreshRubricTotalBox();
        })
        .then(function () {
            return openCookieComponent();
        })
        .catch(function (err) {
            alert("Could not render gradeable: " + err.message);
            console.error(err);
        });
}

/**
 * Reloads the provided component in grade mode
 * @param {int} component_id
 * @returns {Promise}
 */
function reloadGradingComponent(component_id) {
    let component_tmp = null;
    let gradeable_id = getGradeableId();
    return ajaxGetComponentRubric(gradeable_id, component_id)
        .then(function (component) {
            component_tmp = component;
            return ajaxGetGradedComponent(gradeable_id, component_id, getAnonId());
        })
        .then(function (graded_component) {
            return injectGradingComponent(component_tmp, graded_component, false, false);
        })
}

/**
 * Opens the component in the cookie
 * @returns {Promise}
 */
function openCookieComponent() {
    let cookieComponent = getOpenComponentIdFromCookie();
    if (!componentExists(cookieComponent)) {
        return Promise.resolve();
    }
    return toggleComponent(cookieComponent, false);
}

/**
 * Closes all open components and the overall comment
 * @param {boolean} save_changes
 * @return {Promise<void>}
 */
function closeAllComponents(save_changes) {
    let sequence = Promise.resolve();

    // Overall Comment box is open, so close it
    if (isOverallCommentOpen()) {
        sequence = sequence.then(function () {
            return closeOverallComment(true);
        });
    }

    // Close all open components.  There shouldn't be more than one,
    //  but just in case there is...
    getOpenComponentIds().forEach(function (id) {
        sequence = sequence.then(function () {
            return closeComponent(id);
        });
    });
    return sequence;
}

/**
 * Toggles a the open/close state of a component
 * @param {int} component_id the component's id
 * @param {boolean} saveChanges
 * @return {Promise}
 */
function toggleComponent(component_id, saveChanges) {
    let action = Promise.resolve();
    // Component is open, so close it
    if (isComponentOpen(component_id)) {
        action = action.then(function() {
            return closeComponent(component_id, saveChanges);
        });
    } else {
        action = action.then(function () {
            return closeAllComponents(saveChanges)
                .then(function () {
                    return openComponent(component_id);
                });
        });
    }

    // Save the open component in the cookie
    return action.then(function() {
        updateCookieComponent();
    });
}

/**
 * Toggles a the open/close state of the overall comment
 * @param {boolean} saveChanges
 * @return {Promise}
 */
function toggleOverallComment(saveChanges) {
    // Overall comment open, so close it
    if (isOverallCommentOpen()) {
        return closeOverallComment(saveChanges);
    }

    // Close all open components.  There shouldn't be more than one,
    //  but just in case there is...
    let sequence = Promise.resolve();
    getOpenComponentIds().forEach(function (id) {
        sequence = sequence.then(function () {
            return closeComponent(id);
        });
    });

    // Finally, open the overall comment
    return sequence.then(openOverallComment);
}

/**
 * Adds a new mark to the DOM and refreshes the display
 * @param {int} component_id
 * @return {Promise}
 */
function addNewMark(component_id) {
    let component = getComponentFromDOM(component_id);
    component.marks.push({
        id: getNewMarkId(),
        title: '',
        points: 0.0,
        publish: false,
        order: component.marks.length
    });
    let promise = Promise.resolve();
    if (!isInstructorEditEnabled()) {
        let graded_component = getGradedComponentFromDOM(component_id);
        promise = promise.then(function () {
            return injectGradingComponent(component, graded_component, true, true);
        });
    } else {
        promise = promise.then(function () {
            return injectInstructorEditComponent(component, true);
        });
    }
    return promise;
}

/**
 * Toggles the state of a mark in grade mode
 * @return {Promise}
 */
function toggleCommonMark(component_id, mark_id) {
    return isMarkChecked(mark_id) ? unCheckMark(component_id, mark_id) : checkMark(component_id, mark_id);
}

/**
 * Call to update the custom mark state when any of the custom mark fields change
 * @param {int} component_id
 * @return {Promise}
 */
function updateCustomMark(component_id) {
    if (hasCustomMark(component_id)) {
        // Check the mark if it isn't already
        checkDOMCustomMark(component_id);

        // Uncheck the first mark just in case it's checked
        return unCheckFirstMark(component_id);
    } else {
        // Automatically uncheck the custom mark if it's no longer relevant
        unCheckDOMCustomMark(component_id);

        // Note: this is in the else block since `unCheckFirstMark` calls this function
        return refreshGradedComponent(component_id, true);
    }
}

/**
 * Call to toggle the custom mark 'checked' state without removing its data
 * @param {int} component_id
 * @return {Promise}
 */
function toggleCustomMark(component_id) {
    if (isCustomMarkChecked(component_id)) {
        // Uncheck the first mark just in case it's checked
        return unCheckFirstMark(component_id);
    } else {
        // Note: this is in the else block since `unCheckFirstMark` calls this function
        return refreshGradedComponent(component_id, true);
    }
}
/**
 * Opens a component for instructor edit mode
 * NOTE: don't call this function on its own.  Call 'openComponent' Instead
 * @param {int} component_id
 * @return {Promise}
 */
function openComponentInstructorEdit(component_id) {
    let gradeable_id = getGradeableId();
    return ajaxGetComponentRubric(gradeable_id, component_id)
        .then(function (component) {
            // Set the global mark list data for this component for conflict resolution
            OLD_MARK_LIST[component_id] = component.marks;

            // Render the component in instructor edit mode
            //  and 'true' to show the mark list
            return injectInstructorEditComponent(component, true);
        });
}

/**
 * Opens a component for grading mode (including normal edit mode)
 * NOTE: don't call this function on its own.  Call 'openComponent' Instead
 * @param {int} component_id
 * @return {Promise}
 */
function openComponentGrading(component_id) {
    let component_tmp = null;
    let gradeable_id = getGradeableId();
    return ajaxGetComponentRubric(gradeable_id, component_id)
        .then(function (component) {
            // Set the global mark list data for this component for conflict resolution
            OLD_MARK_LIST[component_id] = component.marks;

            component_tmp = component;
            return ajaxGetGradedComponent(gradeable_id, component_id, getAnonId());
        })
        .then(function (graded_component) {
            // Render the grading component with edit mode if enabled,
            //  and 'true' to show the mark list
            return injectGradingComponent(component_tmp, graded_component, isEditModeEnabled(), true);
        });
}

/**
 * Opens the requested component
 * Note: This does not close the currently open component
 * @param {int} component_id
 * @return {Promise}
 */
function openComponent(component_id) {
    setComponentInProgress(component_id);
    // Achieve polymorphism in the interface using this `isInstructorEditEnabled` flag
    return isInstructorEditEnabled() ? openComponentInstructorEdit(component_id) : openComponentGrading(component_id);
}

/**
 * Closes a component for instructor edit mode and saves changes
 * NOTE: don't call this function on its own.  Call 'closeComponent' Instead
 * @param {int} component_id
 * @param {boolean} saveChanges If the changes to the component should be saved or discarded
 * @return {Promise}
 */
function closeComponentInstructorEdit(component_id, saveChanges) {
    let sequence = Promise.resolve();
    if (saveChanges) {
        sequence = sequence
            .then(function () {
                return saveMarkList(component_id);
            })
            .then(function () {
                // Save the component title and comments
                let component = getComponentFromDOM(component_id);
                return ajaxSaveComponent(getGradeableId(), component_id, component.title, component.ta_comment,
                    component.student_comment, component.page, component.lower_clamp,
                    component.default, component.max_value, component.upper_clamp);
            });
    }
    return sequence
        .then(function () {
            return ajaxGetComponentRubric(getGradeableId(), component_id);
        })
        .then(function (component) {
            // Render the component with a hidden mark list
            return injectInstructorEditComponent(component, false);
        });
}

/**
 * Closes a component for grading mode and saves changes
 * NOTE: don't call this function on its own.  Call 'closeComponent' Instead
 * @param {int} component_id
 * @param {boolean} saveChanges If the changes to the (graded) component should be saved or discarded
 * @return {Promise}
 */
function closeComponentGrading(component_id, saveChanges) {
    let sequence = Promise.resolve();
    let gradeable_id = getGradeableId();
    let anon_id = getAnonId();
    let component_tmp = null;

    if (!saveChanges) {
        // We aren't saving changes, so fetch the up-to-date grade / rubric data
        sequence = sequence
            .then(function () {
                return ajaxGetComponentRubric(gradeable_id, component_id);
            })
            .then(function (component) {
                component_tmp = component;
            });
    } else {
        // We are saving changes...
        if (isEditModeEnabled()) {
            // We're in edit mode, so save the component and fetch the up-to-date grade / rubric data
            sequence = sequence
                .then(function () {
                    return saveMarkList(component_id);
                })
                .then(function () {
                    return ajaxGetComponentRubric(gradeable_id, component_id);
                })
                .then(function (component) {
                    component_tmp = component;
                });
        } else {
            // We're in grade mode, so save the graded component
            sequence = sequence
                .then(function () {
                    return saveGradedComponent(component_id);
                });
        }
    }

    // Finally, render the graded component in non-edit mode with the mark list hidden
    return sequence
        .then(function () {
            return ajaxGetGradedComponent(gradeable_id, component_id, anon_id);
        })
        .then(function (graded_component) {
            // If this wasn't set (fetched from the remote), just load it from the DOM
            if (component_tmp === null) {
                component_tmp = getComponentFromDOM(component_id);
            }

            return injectGradingComponent(component_tmp, graded_component, false, false);
        });
}

/**
 * Closes the requested component and saves any changes if requested
 * @param {int} component_id
 * @param {boolean} saveChanges If the changes to the (graded) component should be saved or discarded
 * @return {Promise}
 */
function closeComponent(component_id, saveChanges = true) {
    setComponentInProgress(component_id);
    // Achieve polymorphism in the interface using this `isInstructorEditEnabled` flag
    return isInstructorEditEnabled()
        ? closeComponentInstructorEdit(component_id, saveChanges)
        : closeComponentGrading(component_id, saveChanges)
}

/**
 * Fetches the up-to-date overall comment and opens it for editing
 * @return {Promise}
 */
function openOverallComment() {
    setOverallCommentInProgress();
    return ajaxGetOverallComment(getGradeableId(), getAnonId())
        .then(function (comment) {
            return injectOverallComment(comment, true);
        });
}

/**
 * Closes and saves the overall comment
 * @param {boolean} saveChanges
 * @return {Promise}
 */
function closeOverallComment(saveChanges = true) {
    setOverallCommentInProgress();
    if (saveChanges) {
        return ajaxSaveOverallComment(getGradeableId(), getAnonId(), getOverallCommentFromDOM())
            .then(function () {
                return refreshOverallComment(false);
            });
    } else {
        return ajaxGetOverallComment(getGradeableId(), getAnonId())
            .then(function (comment) {
                return injectOverallComment(comment, false);
            });
    }
}

/**
 * Checks the requested mark and refreshes the component
 * @param {int} component_id
 * @param {int} mark_id
 * @return {Promise}
 */
function checkMark(component_id, mark_id) {
    // Don't let them check a disabled mark
    if (isMarkDisabled(mark_id)) {
        return Promise.resolve();
    }

    // First fetch the necessary information from the DOM
    let gradedComponent = getGradedComponentFromDOM(component_id);

    // Uncheck the first mark if it's checked
    let firstMarkId = getComponentFirstMarkId(component_id);
    if (isMarkChecked(firstMarkId)) {
        // If first mark is checked, it will be the first element in the array
        gradedComponent.mark_ids.splice(0, 1);
    }

    // Then add the mark id to the array
    gradedComponent.mark_ids.push(mark_id);

    // Finally, re-render the component
    return injectGradingComponent(getComponentFromDOM(component_id), gradedComponent, false, true);
}

/**
 * Un-checks the requested mark and refreshes the component
 * @param {int} component_id
 * @param {int} mark_id
 * @return {Promise}
 */
function unCheckMark(component_id, mark_id) {
    // First fetch the necessary information from the DOM
    let gradedComponent = getGradedComponentFromDOM(component_id);

    // Then remove the mark id from the array
    for (let i = 0; i < gradedComponent.mark_ids.length; ++i) {
        if (gradedComponent.mark_ids[i] === mark_id) {
            gradedComponent.mark_ids.splice(i, 1);
            break;
        }
    }

    // Finally, re-render the component
    return injectGradingComponent(getComponentFromDOM(component_id), gradedComponent, false, true);
}

/**
 * Un-checks the full credit / no credit mark of a component
 * @param {int} component_id
 * @return {Promise}
 */
function unCheckFirstMark(component_id) {
    return unCheckMark(component_id, getComponentFirstMarkId(component_id));
}

/**
 * Saves the mark list to the server for a component and handles any conflicts.
 * Properties that are saved are: mark point values, mark titles, and mark order
 * @param {int} component_id
 * @return {Promise}
 */
function saveMarkList(component_id) {
    let gradeable_id = getGradeableId();
    return ajaxGetComponentRubric(gradeable_id, component_id)
        .then(function (component) {
            let domMarkList = getMarkListFromDOM(component_id);
            let serverMarkList = component.marks;
            let oldServerMarkList = OLD_MARK_LIST[component_id];

            // associative array of associative arrays of marks with conflicts {<mark_id>: {domMark, serverMark, oldServerMark}, ...}
            let conflictMarks = {};

            let sequence = Promise.resolve();

            // For each DOM mark, try to save it
            domMarkList.forEach(function (domMark) {
                let serverMark = getMarkFromMarkArray(serverMarkList, domMark.id);
                let oldServerMark = getMarkFromMarkArray(oldServerMarkList, domMark.id);
                sequence = sequence
                    .then(function () {
                        return tryResolveMarkSave(gradeable_id, component_id, domMark, serverMark, oldServerMark);
                    })
                    .then(function (success) {
                        // success of false counts as conflict
                        if (success === false) {
                            conflictMarks[domMark.id] = {
                                domMark: domMark,
                                serverMark: serverMark,
                                oldServerMark: oldServerMark,
                                localDeleted: isMarkDeleted(domMark.id)
                            };
                        }
                    });
            });

            return sequence
                .then(function () {
                    // No conflicts, so don't open the popup
                    if (Object.keys(conflictMarks).length === 0) {
                        return;
                    }

                    // Prompt the user with any conflicts
                    return openMarkConflictPopup(component_id, conflictMarks);
                })
                .then(function () {
                    let markOrder = {};
                    domMarkList.forEach(function(mark) {
                        markOrder[mark.id] = mark.order;
                    });
                    // Finally, save the order
                    return ajaxSaveMarkOrder(gradeable_id, component_id, markOrder);
                });
        });
}

/**
 * Used to check if two marks are equal
 * @param {Object} mark0
 * @param {Object} mark1
 * @return {boolean}
 */
function marksEqual(mark0, mark1) {
    // publish settings only applies in instructor edit mode.  If a non-instructor
    //  edits a mark, it doesn't overwrite the publish setting anyway.
    return mark0.points === mark1.points && mark0.title === mark1.title
        && (!isInstructorEditEnabled() || mark0.publish === mark1.publish);
}

/**
 * Determines what to do when trying to save a mark provided the mark
 *  before edits, the DOM mark, and the server's up-to-date mark
 *  @return {Promise<boolean>} Resolves true on success, false on conflict
 */
function tryResolveMarkSave(gradeable_id, component_id, domMark, serverMark, oldServerMark) {
    let markDeleted = isMarkDeleted(domMark.id);
    if (oldServerMark !== null) {
        if (serverMark !== null) {
            // Mark edited under normal conditions
            if ((marksEqual(domMark, serverMark) || marksEqual(domMark, oldServerMark)) && !markDeleted) {
                // If the domMark is not unique, then we don't need to do anything
                return Promise.resolve(true);
            } else if (!marksEqual(serverMark, oldServerMark)) {
                // The domMark is unique, and the serverMark is also unique,
                // which means all 3 versions are different, which is a conflict state
                return Promise.resolve(false);
            } else if (markDeleted) {
                // domMark was deleted and serverMark hasn't changed from oldServerMark,
                //  so try to delete the mark
                return ajaxDeleteMark(gradeable_id, component_id, domMark.id)
                    .catch(function (err) {
                        err.message = 'Could not delete mark: ' + err.message;
                        throw err;
                    })
                    .then(function () {
                        // Success, then resolve success
                        return Promise.resolve(true);
                    });
            } else {
                // The domMark is unique and the serverMark is the same as the oldServerMark
                //  so we should save the domMark to the server
                return ajaxSaveMark(gradeable_id, component_id, domMark.id, domMark.title, domMark.points, domMark.publish)
                    .then(function () {
                        // Success, then resolve success
                        return Promise.resolve(true);
                    });
            }
        } else {
            // This means it was deleted from the server.
            if (!marksEqual(domMark, oldServerMark) && !markDeleted) {
                // And the mark changed and wasn't deleted, which is a conflict state
                return Promise.resolve(false);
            } else {
                // And the mark didn't change or it was deleted, so don't do anything
                return Promise.resolve(domMark.id);
            }
        }
    } else {
        // This means it didn't exist when we started editing, so serverMark must also be null
        if (markDeleted) {
            // The mark was marked for deletion, but never existed... so do nothing
            return Promise.resolve(true);
        } else {
            // The mark never existed and isn't deleted, so its new
            return ajaxAddNewMark(gradeable_id, component_id, domMark.title, domMark.points)
                .then(function (data) {
                    // Success, then resolve true
                    domMark.id = data.mark_id;
                    return Promise.resolve(true);
                })
                .catch(function (err) {
                    // This means the user's mark was invalid
                    err.message = 'Failed to add mark: ' + err.message;
                    throw err
                });
        }
    }
}

/**
 * Saves the component grade information to the server
 * Note: if the mark was deleted remotely, but the submitter was assigned it locally, the mark
 *  will be resurrected with a new id
 * @param {int} component_id
 * @return {Promise}
 */
function saveGradedComponent(component_id) {
    let gradeable_id = getGradeableId();
    let gradedComponent = getGradedComponentFromDOM(component_id);
    return ajaxGetComponentRubric(getGradeableId(), component_id)
        .then(function (component) {
            let missingMarks = [];
            let domComponent = getComponentFromDOM(component_id);

            // Check each mark the submitter was assigned
            gradedComponent.mark_ids.forEach(function (mark_id) {
                // Mark exists remotely, so no action required
                if (getMarkFromMarkArray(component.marks, mark_id) !== null) {
                    return;
                }
                missingMarks.push(getMarkFromMarkArray(domComponent.marks, mark_id))
            });

            // For each mark missing from the server, add it
            let sequence = Promise.resolve();
            missingMarks.forEach(function (mark) {
                sequence = sequence
                    .then(function () {
                        return ajaxAddNewMark(gradeable_id, component_id, mark.title, mark.points);
                    })
                    .then(function (data) {
                        // Make sure to add it to the grade.  We don't bother removing the deleted mark ids
                        //  however, because the server filters out non-existent mark ids
                        gradedComponent.mark_ids.push(data.mark_id);
                    });
            });
            return sequence;
        })
        .then(function () {
            return ajaxSaveGradedComponent(
                getGradeableId(), component_id, getAnonId(),
                gradedComponent.graded_version,
                gradedComponent.custom_mark_selected ? gradedComponent.score : 0.0,
                gradedComponent.custom_mark_selected ? gradedComponent.comment : '',
                isSilentEditModeEnabled(),
                gradedComponent.mark_ids);
        });
}

/**
 * Re-renders the graded component header with the data in the DOM
 *  and preserves the edit/grade mode display
 * @param {int} component_id
 * @param {boolean} showMarkList Whether the header should be styled like the component is open
 * @return {Promise}
 */
function refreshGradedComponentHeader(component_id, showMarkList) {
    return injectGradingComponentHeader(
        getComponentFromDOM(component_id),
        getGradedComponentFromDOM(component_id), showMarkList);
}


/**
 * Re-renders the graded component with the data in the DOM
 *  and preserves the edit/grade mode display
 * @param {int} component_id
 * @param {boolean} showMarkList Whether the mark list should be visible
 * @return {Promise}
 */
function refreshGradedComponent(component_id, showMarkList) {
    return injectGradingComponent(
        getComponentFromDOM(component_id),
        getGradedComponentFromDOM(component_id),
        isEditModeEnabled(), showMarkList);
}

/**
 * Re-renders the component header with the data in the DOM
 * @param {int} component_id
 * @param {boolean} showMarkList Whether the header should be styled like the component is open
 * @return {Promise}
 */
function refreshInstructorEditComponentHeader(component_id, showMarkList) {
    return injectInstructorEditComponentHeader(getComponentFromDOM(component_id), showMarkList);
}

/**
 * Re-renders the component with the data in the DOM
 * @param {int} component_id
 * @param {boolean} showMarkList Whether the mark list should be visible
 * @return {Promise}
 */
function refreshInstructorEditComponent(component_id, showMarkList) {
    return injectInstructorEditComponent(getComponentFromDOM(component_id), showMarkList);
}

/**
 * Re-renders the component's header block with the data in the DOM
 * @param {int} component_id
 * @param {boolean} showMarkList Whether the header should be styled like the component is open
 * @return {Promise}
 */
function refreshComponentHeader(component_id, showMarkList) {
    return isInstructorEditEnabled() ? refreshInstructorEditComponentHeader(component_id, showMarkList) : refreshGradedComponentHeader(component_id, showMarkList);
}

/**
 * Re-renders the component with the data in the DOM
 * @param {int} component_id
 * @param {boolean} showMarkList Whether the mark list should be visible
 * @return {Promise}
 */
function refreshComponent(component_id, showMarkList) {
    return isInstructorEditEnabled() ? refreshInstructorEditComponent(component_id, showMarkList) : refreshGradedComponent(component_id, showMarkList);
}

/**
 * Re-renders the overall comment with the data in the DOM
 * @param {boolean} showEditable Whether comment should be open for editing
 * @return {Promise}
 */
function refreshOverallComment(showEditable) {
    return injectOverallComment(getOverallCommentFromDOM(), showEditable);
}

/**
 * Refreshes the 'total scores' box at the bottom of the gradeable
 * @return {Promise}
 */
function refreshTotalScoreBox() {
    return injectTotalScoreBox(getScoresFromDOM());
}

/**
 * Refreshes the 'rubric total' box at the top of the rubric editor
 * @returns {Promise}
 */
function refreshRubricTotalBox() {
    return injectRubricTotalBox(getRubricTotalFromDOM());
}

/**
 * Renders the provided component object for instructor edit mode
 * @param {Object} component
 * @param {boolean} showMarkList Whether the mark list should be visible
 * @return {Promise}
 */
function injectInstructorEditComponent(component, showMarkList) {
    return renderEditComponent(component, getPointPrecision(), showMarkList)
        .then(function (elements) {
            setComponentContents(component.id, elements);
        })
        .then(function () {
            return refreshRubricTotalBox();
        });
}

/**
 * Renders the provided component object for instructor edit mode header
 * @param {Object} component
 * @param {boolean} showMarkList Whether to style the header like the mark list is open
 * @return {Promise}
 */
function injectInstructorEditComponentHeader(component, showMarkList) {
    return renderEditComponentHeader(component, getPointPrecision(), showMarkList)
        .then(function (elements) {
            setComponentHeaderContents(component.id, elements);
        })
        .then(function () {
            return refreshRubricTotalBox();
        });
}

/**
 * Renders the provided component/graded_component object for grading/editing
 * @param {Object} component
 * @param {Object} graded_component
 * @param {boolean} editable Whether the component should appear in edit or grade mode
 * @param {boolean} showMarkList Whether to show the mark list or not
 * @return {Promise}
 */
function injectGradingComponent(component, graded_component, editable, showMarkList) {
    return renderGradingComponent(getGraderId(), component, graded_component, isGradingDisabled(), canVerifyGraders(), getPointPrecision(), editable, showMarkList)
        .then(function (elements) {
            setComponentContents(component.id, elements);
        })
        .then(function () {
            return refreshTotalScoreBox();
        });
}

/**
 * Renders the provided component/graded_component header
 * @param {Object} component
 * @param {Object} graded_component
 * @param {boolean} showMarkList Whether to style the header like the mark list is open
 * @return {Promise}
 */
function injectGradingComponentHeader(component, graded_component, showMarkList) {
    return renderGradingComponentHeader(getGraderId(), component, graded_component, isGradingDisabled(), canVerifyGraders(), showMarkList)
        .then(function (elements) {
            setComponentHeaderContents(component.id, elements);
        })
        .then(function () {
            return refreshTotalScoreBox();
        });
}

/**
 * Renders the overall comment
 * @param {string} comment
 * @param {boolean} editable If the comment should be rendered in edit mode
 * @return {Promise}
 */
function injectOverallComment(comment, editable) {
    return renderOverallComment(comment, editable)
        .then(function (elements) {
            setOverallCommentContents(elements);
        });
}

/**
 * Renders the total scores box
 * @param {Object} scores
 * @return {Promise}
 */
function injectTotalScoreBox(scores) {
    return renderTotalScoreBox(scores)
        .then(function (elements) {
            setTotalScoreBoxContents(elements);
        });
}

/**
 * Renders the rubric total box (instructor edit mode)
 * @param {Object} scores
 * @returns {Promise<string>}
 */
function injectRubricTotalBox(scores) {
    return renderRubricTotalBox(scores)
        .then(function(elements) {
            setRubricTotalBoxContents(elements);
        });
}