#[path="./commands/projectBin.rs"] mod project_bin;
#[path="./data/projectBin.rs"] mod project_bin_data;
use std::sync::Mutex;
use std::collections::HashMap;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(project_bin_data::ProjectBinData { contained_files: Mutex::new(HashMap::new()) })
        .invoke_handler(tauri::generate_handler![project_bin::request_new_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
