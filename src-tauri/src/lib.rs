use serde::{Deserialize, Serialize};

const LICENSE_VERIFY_URL: &str = "https://api.sociobot.in/api/v1/products/color-signal-lens/verify";

#[derive(Deserialize)]
struct LicenseApiResponse {
    valid: bool,
}

#[derive(Serialize)]
struct LicenseVerification {
    valid: bool,
}

/// Verify only a Color Signal Lens license through the native HTTP client.
///
/// The desktop webview has a `tauri://`/`tauri.localhost` origin, which the
/// public billing API deliberately does not need to allow with browser CORS.
/// Keeping this exact endpoint and its one token parameter in Rust means no
/// arbitrary URL, header, or response data can cross the command boundary.
#[tauri::command]
async fn verify_license(license: String) -> Result<LicenseVerification, String> {
    let license = license.trim();
    if license.is_empty() || license.len() > 2_048 {
        return Err("Enter a valid license token.".into());
    }

    let response = reqwest::Client::new()
        .get(LICENSE_VERIFY_URL)
        .query(&[("license", license)])
        .send()
        .await
        .map_err(|_| "The license could not be checked.".to_string())?;
    if !response.status().is_success() {
        return Err("The license could not be checked.".into());
    }
    let result = response
        .json::<LicenseApiResponse>()
        .await
        .map_err(|_| "The license could not be checked.".to_string())?;
    Ok(LicenseVerification {
        valid: result.valid,
    })
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![verify_license])
        .run(tauri::generate_context!())
        .expect("error while running Color Signal Lens");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn production_tauri_origin_license_check_uses_native_http() {
        // This is the exact token used to reproduce the browser-CORS failure.
        // The native command must still receive the API's real invalid verdict.
        let verdict =
            tauri::async_runtime::block_on(verify_license("invalid-regression-token".to_string()))
                .expect("the native client can read the production verification response");
        assert!(!verdict.valid);
    }

    #[test]
    fn native_license_command_rejects_empty_tokens_before_networking() {
        let result = tauri::async_runtime::block_on(verify_license("   ".to_string()));
        assert!(result.is_err());
    }
}
