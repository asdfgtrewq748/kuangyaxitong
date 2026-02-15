"""
Agent Team Client - 简单易用的 Agent Team 调用接口

这是你用来调用 Agent Team 的主要入口。
"""

import asyncio
from pathlib import Path
from typing import Dict, Any, List, Optional

from agent_team.coordinator import AgentCoordinator
from agent_team.orchestrator import WorkflowOrchestrator
from agent_team.agents import create_all_agents
from agent_team.core import TaskPriority


class AgentTeamClient:
    """
    Agent Team 客户端

    用法示例:
        client = AgentTeamClient()
        client.start()

        # 提交任务
        task_id = client.optimize_backend()

        # 或者执行工作流
        result = client.run_workflow("optimize_mpi_performance")

        client.stop()
    """

    def __init__(self, workspace_path: str = None):
        self.coordinator = AgentCoordinator(workspace_path)
        self.orchestrator = WorkflowOrchestrator(self.coordinator)
        self._started = False

    def start(self):
        """启动 Agent Team"""
        if self._started:
            return

        # 创建并注册所有 agents
        agents = create_all_agents()
        for agent in agents:
            self.coordinator.register_agent(agent)

        # 启动协调器
        asyncio.run(self.coordinator.start())
        self._started = True
        print("Agent Team 已启动!")

    def stop(self):
        """停止 Agent Team"""
        if self._started:
            asyncio.run(self.coordinator.stop())
            self._started = False

    # ============================================================
    # 快速任务方法 - 这些是最常用的操作
    # ============================================================

    def optimize_backend(self, file_path: str = None) -> str:
        """优化后端 API"""
        task = self.coordinator.create_task(
            title="优化后端 API",
            description="分析和优化后端 API 路由和服务",
            agent_type="backend",
            input_data={"action": "optimize_api", "file_path": file_path},
        )
        return self.coordinator.submit_task(task)

    def optimize_frontend(self) -> str:
        """优化前端打包和组件"""
        task = self.coordinator.create_task(
            title="优化前端",
            description="优化前端组件和打包配置",
            agent_type="frontend",
            input_data={"action": "optimize_bundle"},
        )
        return self.coordinator.submit_task(task)

    def fix_data_encoding(self, file_name: str = None) -> str:
        """修复数据编码问题"""
        task = self.coordinator.create_task(
            title="修复数据编码",
            description="扫描并修复数据文件的编码问题",
            agent_type="data",
            input_data={"action": "fix_csv_encoding", "file_name": file_name},
        )
        return self.coordinator.submit_task(task)

    def optimize_mpi_algorithm(self) -> str:
        """优化 MPI 计算算法"""
        task = self.coordinator.create_task(
            title="优化 MPI 算法",
            description="优化矿压影响指标计算算法",
            agent_type="algorithm",
            input_data={"action": "optimize_mpi"},
            priority=TaskPriority.HIGH,
        )
        return self.coordinator.submit_task(task)

    def run_tests(self) -> str:
        """运行所有测试"""
        task = self.coordinator.create_task(
            title="运行测试",
            description="运行单元测试和集成测试",
            agent_type="testing",
            input_data={"action": "run_all_tests"},
        )
        return self.coordinator.submit_task(task)

    # ============================================================
    # 后端开发任务
    # ============================================================

    def add_api_endpoint(self, path: str, method: str, description: str) -> str:
        """添加新的 API 端点"""
        task = self.coordinator.create_task(
            title=f"添加 API 端点: {method} {path}",
            description=description,
            agent_type="backend",
            input_data={
                "action": "add_endpoint",
                "endpoint": {"path": path, "method": method, "description": description}
            },
        )
        return self.coordinator.submit_task(task)

    def refactor_service(self, service_name: str) -> str:
        """重构服务模块"""
        task = self.coordinator.create_task(
            title=f"重构服务: {service_name}",
            description=f"重构 {service_name} 服务模块",
            agent_type="backend",
            input_data={"action": "refactor_service", "service_name": service_name},
        )
        return self.coordinator.submit_task(task)

    # ============================================================
    # 前端开发任务
    # ============================================================

    def add_page(self, page_name: str, route: str) -> str:
        """添加新页面"""
        task = self.coordinator.create_task(
            title=f"添加页面: {page_name}",
            description=f"创建新页面 {page_name} 并添加路由 {route}",
            agent_type="frontend",
            input_data={
                "action": "add_page",
                "page": {"name": page_name, "route": route}
            },
        )
        return self.coordinator.submit_task(task)

    def add_chart(self, chart_type: str, title: str) -> str:
        """添加图表组件"""
        task = self.coordinator.create_task(
            title=f"添加图表: {title}",
            description=f"添加 {chart_type} 类型的图表组件",
            agent_type="frontend",
            input_data={"action": "add_chart", "chart_type": chart_type, "title": title},
        )
        return self.coordinator.submit_task(task)

    def improve_ui(self, component_path: str) -> str:
        """改进 UI 组件"""
        task = self.coordinator.create_task(
            title=f"改进 UI: {component_path}",
            description="改进组件的 UI/UX 设计",
            agent_type="frontend",
            input_data={"action": "improve_ui", "component_path": component_path},
        )
        return self.coordinator.submit_task(task)

    # ============================================================
    # 数据处理任务
    # ============================================================

    def parse_borehole_data(self, file_name: str) -> str:
        """解析钻孔数据"""
        task = self.coordinator.create_task(
            title=f"解析钻孔数据: {file_name}",
            description="解析钻孔数据文件",
            agent_type="data",
            input_data={"action": "parse_borehole", "file_name": file_name},
        )
        return self.coordinator.submit_task(task)

    def interpolate_field(self, method: str = "kriging") -> str:
        """执行场插值"""
        task = self.coordinator.create_task(
            title=f"场插值: {method}",
            description=f"使用 {method} 方法进行场插值",
            agent_type="data",
            input_data={"action": "interpolate_field", "method": method},
        )
        return self.coordinator.submit_task(task)

    def validate_coordinates(self) -> str:
        """验证坐标数据"""
        task = self.coordinator.create_task(
            title="验证坐标数据",
            description="验证钻孔坐标数据的正确性",
            agent_type="data",
            input_data={"action": "validate_coordinates"},
        )
        return self.coordinator.submit_task(task)

    # ============================================================
    # 算法任务
    # ============================================================

    def improve_interpolation(self, method: str) -> str:
        """改进插值算法"""
        task = self.coordinator.create_task(
            title=f"改进插值算法: {method}",
            description=f"改进 {method} 插值算法的性能",
            agent_type="algorithm",
            input_data={"action": "improve_interpolation", "method": method},
        )
        return self.coordinator.submit_task(task)

    def add_algorithm(self, algorithm_name: str, description: str) -> str:
        """添加新算法"""
        task = self.coordinator.create_task(
            title=f"添加算法: {algorithm_name}",
            description=description,
            agent_type="algorithm",
            input_data={"action": "add_algorithm", "algorithm": algorithm_name},
        )
        return self.coordinator.submit_task(task)

    def benchmark_algorithm(self, algorithm_name: str) -> str:
        """对算法进行基准测试"""
        task = self.coordinator.create_task(
            title=f"算法基准测试: {algorithm_name}",
            description=f"对 {algorithm_name} 算法进行性能测试",
            agent_type="algorithm",
            input_data={"action": "benchmark_algorithm", "algorithm": algorithm_name},
        )
        return self.coordinator.submit_task(task)

    # ============================================================
    # DevOps 任务
    # ============================================================

    def deploy(self, environment: str = "production") -> str:
        """部署应用"""
        task = self.coordinator.create_task(
            title=f"部署到 {environment}",
            description=f"将应用部署到 {environment} 环境",
            agent_type="devops",
            input_data={"action": "deploy", "environment": environment},
            priority=TaskPriority.HIGH,
        )
        return self.coordinator.submit_task(task)

    def setup_monitoring(self) -> str:
        """设置监控"""
        task = self.coordinator.create_task(
            title="设置监控",
            description="设置应用监控和健康检查",
            agent_type="devops",
            input_data={"action": "setup_monitoring"},
        )
        return self.coordinator.submit_task(task)

    def check_services(self) -> str:
        """检查服务状态"""
        task = self.coordinator.create_task(
            title="检查服务状态",
            description="检查所有服务的运行状态",
            agent_type="devops",
            input_data={"action": "check_status"},
        )
        return self.coordinator.submit_task(task)

    # ============================================================
    # 测试任务
    # ============================================================

    def write_unit_test(self, module_path: str) -> str:
        """编写单元测试"""
        task = self.coordinator.create_task(
            title=f"编写单元测试: {module_path}",
            description=f"为 {module_path} 编写单元测试",
            agent_type="testing",
            input_data={"action": "write_unit_test", "module": module_path},
        )
        return self.coordinator.submit_task(task)

    def performance_test(self) -> str:
        """运行性能测试"""
        task = self.coordinator.create_task(
            title="性能测试",
            description="运行应用性能基准测试",
            agent_type="testing",
            input_data={"action": "performance_test"},
        )
        return self.coordinator.submit_task(task)

    # ============================================================
    # 工作流
    # ============================================================

    def run_workflow(self, workflow_name: str) -> Dict[str, Any]:
        """运行预定义工作流"""
        workflow = self.orchestrator.create_workflow_from_template(workflow_name)
        if not workflow:
            print(f"未知的工作流: {workflow_name}")
            print(f"可用的工作流: {', '.join(self.orchestrator.list_templates())}")
            return {}

        print(f"\n启动工作流: {workflow.name}")
        print(f"描述: {workflow.description}")
        print(f"步骤数: {len(workflow.steps)}\n")

        result = asyncio.run(self.orchestrator.execute_workflow(workflow.id))
        return result

    def list_workflows(self) -> List[str]:
        """列出所有可用工作流"""
        return self.orchestrator.list_templates()

    # ============================================================
    # 状态查询
    # ============================================================

    def get_status(self) -> Dict[str, Any]:
        """获取系统状态"""
        return self.coordinator.get_status()

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """获取任务状态"""
        return self.coordinator.get_task_status(task_id)

    def print_status(self):
        """打印系统状态"""
        self.coordinator.print_status()


# ============================================================
# 便捷函数 - 无需创建客户端实例
# ============================================================

_client_instance: Optional[AgentTeamClient] = None


def get_client() -> AgentTeamClient:
    """获取单例客户端实例"""
    global _client_instance
    if _client_instance is None:
        _client_instance = AgentTeamClient()
        _client_instance.start()
    return _client_instance


def quick_task(agent_type: str, action: str, **kwargs) -> str:
    """快速创建任务"""
    client = get_client()
    task = client.coordinator.create_task(
        title=f"{agent_type} - {action}",
        description=kwargs.get("description", f"Quick {agent_type} task"),
        agent_type=agent_type,
        input_data={"action": action, **kwargs},
    )
    return client.coordinator.submit_task(task)


# ============================================================
# 示例用法
# ============================================================

if __name__ == "__main__":
    # 创建客户端
    client = AgentTeamClient()
    client.start()

    # 示例 1: 快速任务
    print("\n=== 示例 1: 快速任务 ===")
    task_id = client.optimize_backend()
    print(f"任务已提交: {task_id}")

    # 示例 2: 添加新功能
    print("\n=== 示例 2: 添加新功能 ===")
    client.add_api_endpoint("/api/pressure/new", "POST", "新的压力计算端点")
    client.add_page("PressureNew", "/pressure/new")

    # 示例 3: 运行工作流
    print("\n=== 示例 3: 工作流 ===")
    print("可用工作流:", client.list_workflows())

    # 查看状态
    print("\n=== 系统状态 ===")
    client.print_status()

    # 停止
    client.stop()
