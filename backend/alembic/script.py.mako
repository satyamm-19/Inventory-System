"""${message}
"""

revision = '${up_revision}'
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}

from alembic import op
import sqlalchemy as sa


def upgrade():
% for stmt in upgrade_ops:
    ${stmt}
% endfor


def downgrade():
% for stmt in downgrade_ops:
    ${stmt}
% endfor
