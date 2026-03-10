use tauri::Manager;

pub mod data;
#[path = "./commands/projectBin.rs"]
mod project_bin;
#[path = "./commands/projectBinDir.rs"]
mod project_bin_dir;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            data::prep_state(app.app_handle());
            return Ok(());
        })
        .invoke_handler(tauri::generate_handler![
            project_bin::request_new_file,
            project_bin_dir::add_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
