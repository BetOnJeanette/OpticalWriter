use tauri::{AppHandle, Emitter, Manager, Runtime, State};
use tauri_plugin_dialog::FilePath;
use std::collections::HashMap;
use std::sync::Mutex;

pub struct ProjectBinData{
    pub contained_files: Mutex<HashMap<String, String>>
} 

pub fn add_files_to_bin<R: Runtime>(files: Vec<FilePath>, app_handle: AppHandle<R>) {
    let mut output: Vec<FilePath> = Vec::new();
    let existing_files:State<ProjectBinData> = app_handle.state();

    for file in files {
        let working_file = file.clone();
        let file_path = working_file.as_path().unwrap();
        let file_path_string = file_path.to_string_lossy().to_string();

        let file_name = file_path.file_name().unwrap();
        let file_name_string = file_name.to_string_lossy().to_string();
        if existing_files.contained_files.lock().unwrap().contains_key(&file_path_string) { break; }
        output.push(file.clone());
        existing_files.contained_files.lock().unwrap().insert(file_path_string, file_name_string);
    }
    app_handle.emit("files-added", output).unwrap();
}
