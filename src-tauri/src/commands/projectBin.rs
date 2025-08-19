use tauri_plugin_dialog::{ DialogExt, FilePath };
use tauri::{ AppHandle, Emitter, Manager, Runtime, State };
use crate::project_bin_data::{self, ProjectBinData};

#[tauri::command]
pub fn request_new_file<R: Runtime>(app_handle: AppHandle<R>) {
    let new_handle = app_handle.clone();
    app_handle.dialog()
        .file()
        .pick_files( move |picked_files| { 
            let Some(safe_files) = picked_files else { return };
            let existing_files: State<ProjectBinData> = app_handle.state();
            let new_files = project_bin_data::add_files_to_bin(safe_files, existing_files);
            send_new_files_to_frontend(new_files, new_handle);
        });
}

pub fn send_new_files_to_frontend<R: Runtime>(files: Vec<FilePath>, app_handle: AppHandle<R>){
    app_handle.emit("files-added", files).unwrap();
}
