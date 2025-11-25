import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const GoodFitApp());
}

class GoodFitApp extends StatelessWidget {
  const GoodFitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GoodFit',
      theme: ThemeData(primarySwatch: Colors.deepPurple),
      home: const GymListPage(),
    );
  }
}

class GymListPage extends StatefulWidget {
  const GymListPage({super.key});

  @override
  State<GymListPage> createState() => _GymListPageState();
}

class _GymListPageState extends State<GymListPage> {
  List gyms = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchGyms();
  }

  Future<void> fetchGyms() async {
    final response = await http.get(Uri.parse('http://10.0.2.2:8000/gyms'));
    if (response.statusCode == 200) {
      setState(() {
        gyms = json.decode(response.body);
        loading = false;
      });
    } else {
      throw Exception('Failed to load gyms');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Залы')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: gyms.length,
              itemBuilder: (context, index) {
                final gym = gyms[index];
                return ListTile(
                  title: Text(gym['name']),
                  subtitle: Text(gym['address'] ?? ''),
                );
              },
            ),
    );
  }
}
