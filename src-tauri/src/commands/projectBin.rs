use tauri_plugin_dialog::{ DialogExt };
use tauri::{ AppHandle, Emitter, Manager, Runtime, State};
use tauri_plugin_dialog::FilePath;
use uuid::{Uuid};
use crate::data::project_bin::{ ProjectBinData, FileData };

#[derive(Clone, serde::Serialize)]
#[serde(rename_all="camelCase")]
struct NewFile {
    new_file: FileData,
    id: String,
    parent_id: String
}

#[tauri::command]
pub fn request_new_file<R: Runtime>(selected_folder_id: String,app_handle: AppHandle<R>) {
    app_handle.dialog()
        .file()
        .pick_files( move |picked_files| { 
            let Some(safe_files) = picked_files else { return };
            if safe_files.len() == 0 { return; }
            add_files_to_bin(safe_files, selected_folder_id, app_handle);
        });
}

pub fn add_files_to_bin<R: Runtime>(files: Vec<FilePath>, selected_folder_id: String, app_handle: AppHandle<R>) {
    let existing_files:State<ProjectBinData> = app_handle.state::<ProjectBinData>();

    for file in files {
        let file_val = get_file_data(&file);
        let file_id = get_new_id(&existing_files);
        existing_files.lock().unwrap().insert(file_id.clone(), file_val.clone());
        let front_file_dat = NewFile {
            new_file: file_val,
            id: file_id,
            parent_id: selected_folder_id.clone()
        };
        let _ = app_handle.emit("file-added", front_file_dat);
    }
}

fn get_file_data(file: &FilePath) -> FileData {
    let working_file = file.clone();
    let file_path = working_file.as_path().unwrap();
    let file_name = file_path.file_name().unwrap();

    let output = FileData{
        path: file_path.to_string_lossy().to_string(),
        display_name: file_name.to_string_lossy().to_string()
    };

    return output;
}

fn get_new_id(existing_files: &State<ProjectBinData>) -> String{
    let mut out = Uuid::new_v4().to_string();
    while existing_files.lock().unwrap().contains_key(&out){
        out = Uuid::new_v4().to_string();
    }
    return out;
}
