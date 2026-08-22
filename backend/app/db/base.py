# Import all the models so that Base has them before being imported by migrations
from backend.app.db.base_class import Base  # noqa
from backend.app.models.user import User  # noqa
from backend.app.models.employee import Employee  # noqa
from backend.app.models.attendance import Attendance  # noqa
from backend.app.models.leave import LeaveRequest  # noqa
from backend.app.models.payroll import Payroll  # noqa
from backend.app.models.notification import Notification  # noqa
from backend.app.models.insight import AIInsight  # noqa
