// ─────────────────────────────────────────────────────
//  FEATURE: Voyage Direction Suffix
//  Auto-appends a letter to voyage codes on a 1-bound
//  (directional) service — decided by the Key column
//  (PortSyncBoundary.isDirectionalService), not the service code.
//  Toggleable via an on-page button; starts OFF every page
//  load — detecting that a service is directional doesn't
//  mean the auto-append should already be running, only that
//  it CAN be turned on for this record.
//
//  Which letter gets appended is NOT just copied from the service
//  suffix — it's whichever letter already shows up most often across
//  every other SV*_start_voyage field on the page right now (e.g. 10
//  voyages already end "E", 2 end "W" -> "E" wins). Real schedules mix
//  both legs' voyages on one page, and the service code's own suffix
//  letter doesn't tell you which leg THIS particular voyage belongs to
//  — the established pattern among the actual voyage numbers already
//  entered does. Falls back to the service's own suffix letter only
//  when nothing's been entered yet to establish a pattern from.
// ─────────────────────────────────────────────────────
const VDirection = {

    enabled: false,  // toggle state lives directly on the feature object

    init() {
        if (!isOnScheduleForm()) return;

        Toolbar.register({
            id:      "tt-voyage-direction-toggle",
            label:   `🧭 Direction: ${this.enabled ? "ON" : "OFF"}`,
            title:   "Toggle automatic direction-letter suffixes on voyage codes",
            group:   "vessel",
            onClick: () => {
                this.enabled = !this.enabled;
                Toolbar.updateLabel("tt-voyage-direction-toggle", `🧭 Direction: ${this.enabled ? "ON" : "OFF"}`);
                console.log(`🧭 Voyage direction auto-suffix: ${this.enabled ? "ON" : "OFF"}`);
            }
        });
    },

    // Scans every other real SV*_start_voyage field on the page and
    // counts which single trailing letter shows up most often. Ties go
    // to whichever letter was encountered first (top-to-bottom row
    // order) — no real-world tie is expected in practice. Returns null
    // if nothing on the page has a letter yet (fresh record).
    mostCommonVoyageLetter() {
        const counts = {};
        document.querySelectorAll('input[name^="SV"][name$="_start_voyage"]:not([name^="PV_"])').forEach(field => {
            const match = field.value.trim().match(/([A-Za-z])$/);
            if (!match) return;
            const letter = match[1].toUpperCase();
            counts[letter] = (counts[letter] || 0) + 1;
        });

        let best = null, bestCount = 0;
        for (const [letter, count] of Object.entries(counts)) {
            if (count > bestCount) { best = letter; bestCount = count; }
        }
        return best;
    },

    handle(event) {
        if (!this.enabled) return;  // skip everything if toggled off

        const target = event.target;
        const { name, value } = target;

        // Only act on real SV*_start_voyage fields, not PV_ duplicates.
        if (!name.match(/^SV\d+_start_voyage$/) || name.startsWith("PV_")) return;

        if (!PortSyncBoundary.isDirectionalService()) return; // 2 bounds — each bound has its own letter

        if (!value.trim()) return;        // nothing typed yet
        if (/[A-Za-z]/.test(value)) return; // already has a letter anywhere in it — don't touch it

        // Pattern from the voyages already entered, else the service code's own letter ("ABC-E").
        const serviceMatch = (document.querySelector('input[name="service"]')?.value || "").trim().match(/-([A-Za-z])$/);
        const letter = this.mostCommonVoyageLetter() || serviceMatch?.[1].toUpperCase();
        if (!letter) return; // no pattern yet and no suffix letter to fall back on

        setFieldValue(target, value + letter);
    },

    // Reserved for future use — not currently needed.
    handleBlur(event) {}
};
