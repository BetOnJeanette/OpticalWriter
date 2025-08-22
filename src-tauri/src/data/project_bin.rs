use tauri::{AppHandle, Emitter, Manager, Runtime, State};
use tauri_plugin_dialog::FilePath;
use std::collections::HashMap;
use std::sync::Mutex;

pub struct ProjectBinData{
    contained_files: Mutex<HashMap<String, String>>
} 

pub fn add_files_to_bin<R: Runtime>(files: Vec<FilePath>, app_handle: AppHandle<R>) {
    let mut output: Vec<String> = Vec::new();
    let existing_files:State<ProjectBinData> = app_handle.state::<ProjectBinData>();

    for file in files {
        let working_file = file.clone();
        let file_path = working_file.as_path().unwrap();
        let file_path_string = file_path.to_string_lossy().to_string();

        let file_name = file_path.file_name().unwrap();
        let file_name_string = file_name.to_string_lossy().to_string();
        if existing_files.contained_files.lock().unwrap().contains_key(&file_path_string) { break; }
        output.push(file_path_string.clone());
        existing_files.contained_files.lock().unwrap().insert(file_path_string, file_name_string);
    }
    app_handle.emit("files-added", output).unwrap();
}

#[inline]
fn get_init_state() -> ProjectBinData {
    return ProjectBinData { contained_files: Mutex::new(HashMap::new()) };
}

pub fn init_state(man: &AppHandle){
    man.manage(get_init_state());
}
