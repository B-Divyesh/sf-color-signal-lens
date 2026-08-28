# Demo sandbox

Open `/demo` or `/?demo=1` to start the isolated demo. It loads
`checkout-totals.diff.png`, a realistic red/green code-diff screenshot created
inside the app. Choose a colour in the screenshot and switch between label,
pattern, and blue/orange remap.

The demo writes only `demo:color-signal-lens:started` in browser localStorage.
`Reset demo` removes and recreates that key. The demo never reads a real
namespace and sends no screenshot request to another origin.
