/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch, 2013-2014 */

Components.utils.import("resource://gre/modules/Services.jsm");

var obmdev = (function() {
  const PREF_STRING = Components.interfaces.nsIPrefBranch.PREF_STRING;
  const PREF_INT = Components.interfaces.nsIPrefBranch.PREF_INT;
  const PREF_BOOL = Components.interfaces.nsIPrefBranch.PREF_BOOL;
  const PREF_INVALID = Components.interfaces.nsIPrefBranch.PREF_INVALID;

  // Get the login name for display
  function setupUserLabel() {
    let logins = Services.logins.findLogins({}, "obm-obm-obm", null, "obm-obm-obm");
    let username;
    if (logins && logins.length) {
      username = logins[0].username;
    }

    // Set up username label
    let button = document.getElementById("obm-user-toolbarbutton");
    button.setAttribute("label", username || "<None>"); // L10N

    // Set up dock icon, if supported. Will only show when there is at least 1
    // unread message.
    if ("@mozilla.org/widget/macdocksupport;1" in Components.classes) {
      function updateBadgeText() {
        let dockSupport = Components.classes["@mozilla.org/widget/macdocksupport;1"]
                                    .getService(Components.interfaces.nsIMacDockSupport);
        dockSupport.badgeText = username;
      }

      Services.obs.addObserver({
        observe: function() setTimeout(updateBadgeText, 0)
      },"before-unread-count-display", false);
      updateBadgeText();
    }
  }
  window.addEventListener("load", setupUserLabel, false);



  function setChecked(id, val) {
    if (val) {
      document.getElementById(id).setAttribute("checked", "true");
    } else {
      document.getElementById(id).removeAttribute("checked");
    }
  }

  function flipPref(prefName) {
    Services.prefs.setBoolPref(prefName, !Services.prefs.getBoolPref(prefName));
  }
  function promptPref(prefName) {
    let pt = Services.prefs.getPrefType(prefName);
    let val, res;
    switch (pt) {
      case PREF_STRING: val = Services.prefs.getCharPref(prefName); break;
      case PREF_INT: val = Services.prefs.getIntPref(prefName); break;
      default: throw new Error("Invalid pref type");
    }
      
    res = prompt(prefName, val);

    switch (pt) {
      case PREF_STRING: Services.prefs.setCharPref(prefName, res); break;
      case PREF_INT: Services.prefs.setIntPref(prefName, res); break;
      default: throw new Error("Invalid pref type");
    }
  }

  function toolbarPopupShowing() {
    setChecked("obm-dev-proactive", Services.prefs.getBoolPref("extensions.obm.proactiveSync"));
  }

  function initPrefsMenu() {
    let popup = document.getElementById("obm-dev-prefs-popup");
    while (popup.lastChild.id != "obm-dev-config-sep") {
      popup.removeChild(popup.lastChild);
    }

    let branch = Services.prefs.getBranch("extensions.obm.");
    for each (let prefName in branch.getChildList("", {})) {
      let mi = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "menuitem");
      mi.setAttribute("pref", "extensions.obm." + prefName);
      let pt = branch.getPrefType(prefName);
      switch (pt) {
        case PREF_BOOL:
          mi.setAttribute("oncommand", "obmdev.flipPref(event.target.getAttribute('pref'))");
          mi.setAttribute("label", prefName);
          mi.setAttribute("type", "checkbox");
          if (branch.getBoolPref(prefName)) mi.setAttribute("checked", "true");
          break;
        case PREF_INT:
          mi.setAttribute("oncommand", "obmdev.promptPref(event.target.getAttribute('pref'))");
          mi.setAttribute("label", prefName + " = " + branch.getIntPref(prefName));
          break;
        case PREF_STRING:
          mi.setAttribute("oncommand", "obmdev.promptPref(event.target.getAttribute('pref'))");
          mi.setAttribute("label", prefName + " = " + branch.getCharPref(prefName));
          break;
      }
      popup.appendChild(mi);
    }
  }

  return {
    toolbarPopupShowing: toolbarPopupShowing,
    initPrefsMenu: initPrefsMenu,
    flipPref: flipPref,
    promptPref: promptPref
  };
})();
