use base64::{engine::general_purpose::STANDARD, Engine as _};
use image::{DynamicImage, ImageOutputFormat};
use std::io::Cursor;

#[tauri::command]
fn capture_primary_screen() -> Result<String, String> {
    let screens = screenshots::Screen::all().map_err(|error| format!("Could not list screens: {error}"))?;
    let screen = screens.first().ok_or_else(|| "No screen is available. Open a screenshot instead.".to_string())?;
    let capture = screen.capture().map_err(|error| format!("Screen capture did not complete: {error}"))?;
    let mut bytes = Vec::new();
    DynamicImage::ImageRgba8(capture)
        .write_to(&mut Cursor::new(&mut bytes), ImageOutputFormat::Png)
        .map_err(|error| format!("Could not prepare the capture: {error}"))?;
    Ok(format!("data:image/png;base64,{}", STANDARD.encode(bytes)))
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![capture_primary_screen])
        .run(tauri::generate_context!())
        .expect("error while running Color Signal Lens");
}
