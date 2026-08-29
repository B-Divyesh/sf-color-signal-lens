# Demo sandbox

Open `/demo` or `/?demo=1`, or choose **Try it with sample data** on the first
screen. The demo opens `checkout-totals.diff.png`, a sample checkout diff with
added and removed totals. Its initial screen shows the patterned sample and the
active cue before import controls.

The persistent banner says **Demo — sample data, nothing is saved**. **Reset
demo** restores the sample and removes every `demo:color-signal-lens:*` key.
**Start for real** discards the sample and opens `/lens`.

Demo storage uses only the `demo:color-signal-lens:*` namespace. It never reads
or writes real license or preset keys. The sample is bundled with the app, so
the loaded demo remains usable offline.
