import subprocess

def call_cfm_toolbox_conversion(input_file: str, output_file: str) -> None:
    """
    Call the cfmtoolbox command line tool to convert files.
    
    Args:
        input_file (str): Path to the input file.
        output_file (str): Path to the output file.
    Raises:
        RuntimeError: If the conversion fails. (Toolbox raises an error.)
    """
    try:
        subprocess.run(
            ["cfmtoolbox", "--import", input_file, "--export", output_file, "convert"],
            check=True,
            capture_output=True,
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Error during conversion: {e.stderr.decode()}") from e