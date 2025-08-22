use tauri::{AppHandle};
pub mod project_bin;
pub mod project_bin_dir;

pub fn prep_state(man: &AppHandle){
    project_bin::init_state(&man); 
}
