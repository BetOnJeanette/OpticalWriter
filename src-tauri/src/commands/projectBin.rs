use tauri_plugin_dialog::{ DialogExt };
use tauri::{ AppHandle, Runtime };
use crate::project_bin_data::{self};

#[tauri::command]
pub fn request_new_file() {
    println!("Openning dialog");
    /*
    app_handle.dialog()
        .file()
        .pick_files( move |picked_files| { 
            println!("adding files {}", picked_files.iter().len());
            let Some(safe_files) = picked_files else { return };
            if safe_files.len() == 0 { return; }
            project_bin_data::add_files_to_bin(safe_files, app_handle);
        });
*/
}

