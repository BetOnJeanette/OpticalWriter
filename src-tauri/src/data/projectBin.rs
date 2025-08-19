use tauri::State;
use tauri_plugin_dialog::FilePath;
use std::collections::HashMap;
use std::sync::Mutex;

pub struct ProjectBinData{
    pub contained_files: Mutex<HashMap<String, String>>
} 

pub fn add_files_to_bin(files: Vec<FilePath>, existing_files: State<ProjectBinData>) -> Vec<FilePath> {
    let mut output: Vec<FilePath> = Vec::new();
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
    return output;
}
