#[path="./commands/projectBin.rs"] mod project_bin;
//#[path="./data/projectBin.rs"] mod project_bin_data;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            app.manage(project_bin::project_bin_data::get_init_state());
            return Ok(());
        })
        .invoke_handler(tauri::generate_handler![project_bin::request_new_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
