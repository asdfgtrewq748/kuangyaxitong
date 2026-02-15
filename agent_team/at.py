#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
at - Agent Team 命令行工具

快速调用 Agent Team 的命令行工具。

用法:
    at optimize backend      # 优化后端
    at add api /path        # 添加 API
    at run workflow         # 运行工作流
    at status               # 查看状态
"""

import sys
import os
from pathlib import Path

# 添加父目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent_team.client import AgentTeamClient, get_client


def print_usage():
    """打印使用说明"""
    print("""
Agent Team 命令行工具

用法:
    at <command> [args...]

命令:

优化任务:
    optimize backend              优化后端 API
    optimize frontend             优化前端
    optimize mpi                 优化 MPI 算法
    optimize all                 运行完整优化工作流

开发任务:
    add api <path> <method>      添加 API 端点 (例: add api /test GET)
    add page <name> <route>      添加页面 (例: add page Test /test)
    add chart <type> <title>     添加图表 (例: add chart line '压力图')

数据任务:
    data fix                     修复数据编码
    data parse <file>            解析钻孔数据
    data interpolate             执行场插值

测试任务:
    test run                     运行所有测试
    test perf                    运行性能测试
    test unit <module>           编写单元测试

DevOps:
    deploy [env]                 部署应用 (默认: production)
    services                     检查服务状态
    monitor                      设置监控

工作流:
    workflow list                列出所有工作流
    workflow run <name>          运行工作流

状态:
    status                       显示系统状态
    agents                       显示所有 Agent
    task <id>                   查看任务状态

其他:
    help                         显示帮助
    interactive                  进入交互模式

示例:
    at optimize backend
    at add api /pressure POST
    at workflow run optimize_mpi_performance
    at status
""")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print_usage()
        return

    command = sys.argv[1].lower()
    args = sys.argv[2:]

    # 创建或获取客户端
    client = get_client()

    # 处理命令
    try:
        if command == "optimize":
            handle_optimize(client, args)
        elif command == "add":
            handle_add(client, args)
        elif command == "data":
            handle_data(client, args)
        elif command == "test":
            handle_test(client, args)
        elif command == "deploy":
            handle_deploy(client, args)
        elif command == "services":
            handle_services(client)
        elif command == "monitor":
            handle_monitor(client)
        elif command == "workflow":
            handle_workflow(client, args)
        elif command == "status":
            client.print_status()
        elif command == "agents":
            status = client.get_status()
            print("\n=== Agents ===")
            for agent_id, info in status["agents"].items():
                print(f"  [{info['status']}] {info['name']} ({info['type']})")
        elif command == "task":
            if args:
                status = client.get_task_status(args[0])
                if status:
                    print(f"\nTask: {status['title']}")
                    print(f"Status: {status['status']}")
                    print(f"Agent: {status['agent_type']}")
                else:
                    print(f"Task not found: {args[0]}")
            else:
                print("Usage: at task <task_id>")
        elif command == "help":
            print_usage()
        elif command == "interactive":
            from agent_team.demo_interactive import InteractiveDemo
            demo = InteractiveDemo()
            demo.run()
        else:
            print(f"Unknown command: {command}")
            print("Run 'at help' for usage")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()


def handle_optimize(client, args):
    """处理优化命令"""
    if not args:
        print("Usage: at optimize <backend|frontend|mpi|all>")
        return

    target = args[0].lower()

    if target == "backend":
        task_id = client.optimize_backend()
        print(f"Task submitted: {task_id}")
    elif target == "frontend":
        task_id = client.optimize_frontend()
        print(f"Task submitted: {task_id}")
    elif target == "mpi":
        task_id = client.optimize_mpi_algorithm()
        print(f"Task submitted: {task_id}")
    elif target == "all":
        print("Running optimization workflow...")
        result = client.run_workflow("optimize_mpi_performance")
        print(f"Workflow completed: {len(result)} steps")
    else:
        print(f"Unknown target: {target}")


def handle_add(client, args):
    """处理添加命令"""
    if not args:
        print("Usage: at add <api|page|chart> ...")
        return

    target = args[0].lower()

    if target == "api":
        if len(args) < 3:
            print("Usage: at add api <path> <method> [description]")
            return
        path = args[1]
        method = args[2].upper()
        desc = args[3] if len(args) > 3 else f"{method} {path}"
        task_id = client.add_api_endpoint(path, method, desc)
        print(f"Task submitted: {task_id}")

    elif target == "page":
        if len(args) < 3:
            print("Usage: at add page <name> <route>")
            return
        name = args[1]
        route = args[2]
        task_id = client.add_page(name, route)
        print(f"Task submitted: {task_id}")

    elif target == "chart":
        if len(args) < 3:
            print("Usage: at add chart <type> <title>")
            return
        chart_type = args[1]
        title = args[2]
        task_id = client.add_chart(chart_type, title)
        print(f"Task submitted: {task_id}")

    else:
        print(f"Unknown target: {target}")


def handle_data(client, args):
    """处理数据命令"""
    if not args:
        print("Usage: at data <fix|parse|interpolate> ...")
        return

    target = args[0].lower()

    if target == "fix":
        file_name = args[1] if len(args) > 1 else None
        task_id = client.fix_data_encoding(file_name)
        print(f"Task submitted: {task_id}")

    elif target == "parse":
        if len(args) < 2:
            print("Usage: at data parse <file_name>")
            return
        task_id = client.parse_borehole_data(args[1])
        print(f"Task submitted: {task_id}")

    elif target == "interpolate":
        method = args[1] if len(args) > 1 else "kriging"
        task_id = client.interpolate_field(method)
        print(f"Task submitted: {task_id}")

    else:
        print(f"Unknown target: {target}")


def handle_test(client, args):
    """处理测试命令"""
    if not args:
        print("Usage: at test <run|perf|unit> ...")
        return

    target = args[0].lower()

    if target == "run":
        task_id = client.run_tests()
        print(f"Task submitted: {task_id}")

    elif target == "perf":
        task_id = client.performance_test()
        print(f"Task submitted: {task_id}")

    elif target == "unit":
        if len(args) < 2:
            print("Usage: at test unit <module_path>")
            return
        task_id = client.write_unit_test(args[1])
        print(f"Task submitted: {task_id}")

    else:
        print(f"Unknown target: {target}")


def handle_deploy(client, args):
    """处理部署命令"""
    env = args[0] if args else "production"
    task_id = client.deploy(env)
    print(f"Task submitted: {task_id}")


def handle_services(client):
    """处理服务状态命令"""
    task_id = client.check_services()
    print(f"Task submitted: {task_id}")


def handle_monitor(client):
    """处理监控命令"""
    task_id = client.setup_monitoring()
    print(f"Task submitted: {task_id}")


def handle_workflow(client, args):
    """处理工作流命令"""
    if not args:
        print("Usage: at workflow <list|run> ...")
        return

    target = args[0].lower()

    if target == "list":
        workflows = client.list_workflows()
        print("\nAvailable workflows:")
        for wf in workflows:
            print(f"  - {wf}")

    elif target == "run":
        if len(args) < 2:
            print("Usage: at workflow run <workflow_name>")
            return
        workflow_name = args[1]
        print(f"\nRunning workflow: {workflow_name}")
        result = client.run_workflow(workflow_name)
        print(f"Workflow completed with {len(result)} steps")

    else:
        print(f"Unknown target: {target}")


if __name__ == "__main__":
    main()
