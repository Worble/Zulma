import shutil
import os.path
import sys
from subprocess import call
import toml  # https://pypi.org/project/toml/

abs_path = sys.path[0]
config_file = f'{abs_path}/config.toml'
config_key_extra = 'extra'
config_key_themes = 'zulma_themes'
npx_path = shutil.which('npx')

# Check we have npm available
if not npx_path:
    print('npx not found, aborting...')
    exit

# Check we have a config file
if not os.path.isfile(config_file):
    print('Config file not found, please ensure the python file is in the root of your project. Aborting...')
    exit

# Parse the config file -- REQUIRES toml LIBRARY
file = open(config_file, 'r')
parsed_toml = toml.loads(file.read())
file.close()

# Get the themes, default to 'default' if none found.
themes = parsed_toml[config_key_extra][config_key_themes]

# Call purgecss on for each theme
for theme in themes:
    purgecss_string = f'purgecss --css {abs_path}/public/{theme}.css --content {abs_path}/public/**/*.html --out {abs_path}/public/'
    call(f'{npx_path} -p purgecss -c "{purgecss_string}"')
