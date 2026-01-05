use tauri_plugin_dialog::{ DialogExt };
use tauri::{ AppHandle, Emitter, Manager, Runtime, State};
use tauri_plugin_dialog::FilePath;
use uuid::{Uuid};
use crate::data::project_bin::{ ProjectBinData, FileData };

#[tauri::command]
pub fn request_new_file<R: Runtime>(app_handle: AppHandle<R>) {
    app_handle.dialog()
        .file()
        .pick_files( move |picked_files| { 
            let Some(safe_files) = picked_files else { return };
            if safe_files.len() == 0 { return; }
            add_files_to_bin(safe_files, app_handle);
        });
}

pub fn add_files_to_bin<R: Runtime>(files: Vec<FilePath>, app_handle: AppHandle<R>) {
    let mut output: Vec<FileData> = Vec::new();
    let existing_files:State<ProjectBinData> = app_handle.state::<ProjectBinData>();

    for file in files {
        let file_val = get_file_data(file);
        let file_id = get_new_id(existing_files);
        output.push(file_val);
        existing_files.lock().unwrap().insert(file_id, file_val);
    }
    app_handle.emit("files-added", output).unwrap();
}

fn get_file_data(&file: FilePath) -> FileData {
    let working_file = file.clone();
    let file_path = working_file.as_path().unwrap();
    let file_path_string = file_path.to_string_lossy().to_string();

    let file_name = file_path.file_name().unwrap();
    let file_name_string = file_name.to_string_lossy().to_string();

    let output = FileData{
        path: file_path.to_string_lossy().to_string(),
        display_name: file_name.to_string_lossy().to_string()
    };

    return output;
}

fn get_new_id(existing_files:State<ProjectBinData>) -> String{
    let mut out = Uuid::new_v4().to_string();
    while existing_files.lock().unwrap().contains_key(&out){
        out = Uuid::new_v4().to_string();
    }
    return out;
}
