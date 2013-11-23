/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2013 */

(function() {
    function obmdevLoadDialog(item) {
        let rv = calLoadDialog.apply(this, arguments);
        document.getElementById("obmdev-obmid").textContent =
            item.getProperty("X-OBM-ID");

        let isInternal = (item.getProperty("X-OBMEXT-IS-INTERNAL") == "YES");
        document.getElementById("obmdev-internal").hidden = !isInternal;

        return rv;
    }

    let calLoadDialog = loadDialog;
    loadDialog = obmdevLoadDialog;

    function obmdevUpdateCalendar() {
        let calendar = getCurrentCalendar();
        let isOBMCalendar = (calendar.type == "obm");
        document.getElementById("obmdev-obmid-row").hidden = !isOBMCalendar;
        document.getElementById("obmdev-info-separator").hidden = !isOBMCalendar;


        return calUpdateCalendar.apply(this, arguments);
    }

    let calUpdateCalendar = updateCalendar;
    updateCalendar = obmdevUpdateCalendar;
})();
